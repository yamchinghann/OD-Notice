function triggerPreviewPage() {
    let options = {};
    options.isSave = false;

    let currentHtmlNode = $(this).context.activeElement;
    let refreshButtonId = $(currentHtmlNode)[0].id;
    updateProps(refreshButtonId, "Enabled", false);

    try {
        let schemeRefNo = checkSchemeRefNo(getFormFieldValue("SchemeRefNoCaseInfo"), getFormFieldValue("TempSchemeRefNo"));
        eFormHelper.getFormAsPDF(options, function (result) {
            // Here, 'result' is the output parameter

            if (result.isSuccess) {

                $(currentHtmlNode).val("Refresh Preview");

                let url = "data:application/pdf;base64, " + result.data;
                $("#previewPane").css('width', '100%');

                fetch(url)
                    .then(function (res) {
                        return res.blob();
                    })
                    .then(function (res) {
                        let url = URL.createObjectURL(res);

                        $("#previewPane").html('<embed src="' + url + '" type="application/pdf" style="width:100%; min-height: 60vh">\
        alt : <a href="'+ url + '" target="_blank">' + schemeRefNo + '.pdf</a>\
    </object>');

                        //success enabled the button back
                        updateProps(refreshButtonId, "Enabled", true);
                    });
            }
            else {
                //when failed to get enabled the button back
                updateProps(refreshButtonId, "Enabled", true);
                console.error(result.error);
            }
        });
    }
    catch (e)
    {
        //any error enable the button back
        updateProps(refreshButtonId, "Enabled", true);
        console.error(e);
    }
}
