module.exports = function(hbs) {

    hbs.registerHelper("booleanCheckboxHelper", function(boolean) {
        let str = "";
        if (boolean) str = "checked";
        return new hbs.SafeString(str);
      });


    hbs.registerHelper("jsonStringify", function(jsonObject) {
        return new hbs.SafeString(JSON.stringify(jsonObject));
      });

    hbs.registerHelper("jsonParse", function(jsonString) {
        return new hbs.SafeString(JSON.parse(jsonString));
      });
}