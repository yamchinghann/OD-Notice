/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

function hideMCInfoRows() {
  $('.summaryColumnsEditRow').find('[controlholdername="HUSApprovalStatusDisplayHUSDetailsHUSI"]').hide();
  $('.summaryColumnsEditRow').find('[controlholdername="Breakdown"]').hide();
  $('.summaryColumnsEditRow').find('[controlholdername="Collapse"]').hide();
}