/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */
function setSocsoOfficeName(evt) {
	console.log(evt)
    let elm = evt.target;
  let txt = elm.options[elm.selectedIndex].text;
  let val = elm.options[elm.selectedIndex].value;
  setFormField('PreferredSocsoOfficeName', txt);
}