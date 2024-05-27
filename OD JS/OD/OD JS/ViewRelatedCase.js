function viewRelatedCase(event) {
  var elm = event.currentTarget;
  console.log(elm);
  var refNo = $(elm).closest(".subFormContentRow").find("[controlholdername='SchemeRefNo1']").find("input").val();
  var noticeType = $(elm).closest(".subFormContentRow").find("[controlholdername='NoticeType1']").find("input").val();
  var url;
  if(noticeType == 'Accident Notice'){
      url = '/ApplicationBuilder/eFormRender.html?SchemeRefNo=' + refNo + '&Process=History Accident Process'
  }else if(noticeType == 'Death Notice'){
      url = '/ApplicationBuilder/eFormRender.html?SchemeRefNo=' + refNo + '&Process=History Death Notice'
  }else if(noticeType == 'HUK Notice'){
    url = '/ApplicationBuilder/eFormRender.html?SchemeRefNo=' + refNo + '&Process=History HUK Process'
  }else if(noticeType == 'Invalidity Notice'){
    url = '/ApplicationBuilder/eFormRender.html?SchemeRefNo=' + refNo + '&Process=History nvalidityNotice'
  }else if(noticeType == 'Occupational Disease Notice'){
    url = '/ApplicationBuilder/eFormRender.html?SchemeRefNo=' + refNo + '&Process=History OD Process'
  }
  console.log(refNo)
  window.open(url)
}

function viewRelatedCase_CaseInfo(event) {
  var elm = event.currentTarget;
  var refNo = $(elm).closest(".ap-fb-subCtrlPreviewRow").find("[controlholdername='SchemeRefNoSF']").find("input").val();
  var url = '/ApplicationBuilder/eFormRender.html?SchemeRefNo='+refNo+'&Process=History OD Process'
  window.open(url)
}