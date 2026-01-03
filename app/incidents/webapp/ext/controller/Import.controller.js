sap.ui.define([
  "sap/ui/core/mvc/ControllerExtension",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (ControllerExtension, MessageToast, MessageBox) {
  "use strict";

  return ControllerExtension.extend("ns.incidents.ext.controller.Import", {
    override: {
      onInit: function () {}
    },

    onOpenImportDialog: function () {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv,text/csv";

      input.onchange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        try {
          const csvText = await file.text();
          await this._callImportAction(csvText);
        } catch (err) {
          MessageBox.error(err?.message || String(err));
        }
      };

      input.click();
    },

    _callImportAction: async function (csvText) {
      try {
        const oView = this.base.getView();

        // ✅ Must exist if manifest model "import" is configured correctly
        const oImportModel = oView.getModel("import");
        if (!oImportModel) {
          MessageBox.error(
            'Import model not found. Check manifest.json: models -> "import" and dataSources -> "importService".'
          );
          return;
        }

        const oOp = oImportModel.bindContext("/importCSV(...)", null, { $$groupId: "$direct" });
        oOp.setParameter("csv", csvText);

        const oResultContext = await oOp.execute();
        const resultObj = oResultContext?.getObject?.();

        // V4 primitive often returns { value: "..." }
        const msg = (resultObj && typeof resultObj === "object" && "value" in resultObj)
          ? resultObj.value
          : resultObj;

        MessageToast.show(msg || "Import finished.");
      } catch (e) {
        MessageBox.error(e?.message || "Import failed.");
      }
    }
  });
});
