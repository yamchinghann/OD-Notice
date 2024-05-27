function checkProvisionDate(check_date)
  {

    //provisional date minimum date = mb session date + 6 months

	//alert("changed");
    var mb_date = radField("SubForm26/Date17")[0];
    console.log(mb_date);
    mb_date = mb_date.split("/").reverse().join("-");
    Date.parse(mb_date);
    var mb_formatted = new Date(mb_date);
    console.log(mb_formatted);

    var minimum_date = mb_formatted.setMonth(mb_formatted.getMonth()+6);
    console.log(minimum_date);
    var input = check_date.value;
    var input_formatted = input.split("/").reverse().join("-");
    Date.parse(input_formatted);
    input_formatted = new Date(input_formatted);
    console.log(input_formatted);

    if(input_formatted < minimum_date)
    {
      alert("The provisional date should be at least after 6 months of MB session date.");
      check_date.value = "";
    }else
    {
      console.log("The provisional date is more than 6 months after the MB session date");
    }

      
  }
