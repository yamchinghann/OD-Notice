/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

eFormEvents.onSectionNavigation = function (eventArgs) {
  // Functionality goes here

  // eventArgs.currentSection - will give the current 
  // section's header

  // eventArgs.previousSection -  will give the previous section's 
  // header from where it got navigated.

  currentSectionTitle = eventArgs.currentSection[0].children[0].textContent;
  
  // Disable section
  document.getElementById("formPreviewSite").disabled = false;
  if ((currentSectionTitle == "Inconsistent & Doubtful Information" && $("#DisableSectionIDI")[0].value == "Yes") || (currentSectionTitle == "Appointment" && $("#DisableSectionA")[0].value == "Yes") || (currentSectionTitle == "Investigation Document" && $("#DisableSectionID")[0].value == "Yes") || (currentSectionTitle == "Medical/PPN/ARO Opinion" && $("#DisableSectionO")[0].value == "Yes")) {
    document.getElementById("formPreviewSite").disabled = true;
  }
  
  // Hide save button
  if ($('[id^="sectionTabs"] > *').last()[0] == eventArgs.currentSection[0]) {
    $('.save').hide();
  }
}

