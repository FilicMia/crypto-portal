//inside mongodb console.
//check the data structure.
var schemaObj= db.Comments.findOne();

function printSchema(obj, indent) {
        for (var key in obj) {
            print(indent, key, typeof obj[key]) ;
            if (typeof obj[key] == "object") {
                printSchema(obj[key], indent + "\t")
            }
        }
    };
printSchema(schemaObj,"");