document.addEventListener('DOMContentLoaded', function(){
    
    var forma = document.getElementById('commentForma');
    console.log(forma);
    
    var btn = forma.getElementsByTagName('button')[0];
    btn.addEventListener('click', function(event) {
        //check imput fields.
        var nameInput = document.getElementById('name').value;
        var commentInput = document.getElementById('comment').value;
        
        console.log(nameInput);
        console.log(commentInput);
        
        var nameReg = new RegExp("^[0-9a-zčćžšđ]{1,6}$", "i");
        var commentReg = new RegExp("[\w\s;.,!?: ]{1,500}", "i");
        
        var alertStr = "";
        
        var nameTest = nameReg.test(nameInput);
        var commentTest = commentReg.test(commentInput.trim());
        
        if(!nameTest){
            alertStr += "Invalid form of the name. The name should have "+
            "one up to six alphanumeric characters.\n";
        }
        
        if(!commentTest){
            console.log(commentTest);
            alertStr += "Invalid form of the comment. The comment should be "+
            "at most 500 characters long.";
        }
        
        if(!nameTest || !commentTest){
            alert(alertStr);
            event.preventDefault();
            
        }else {
            //store the data
        }
    })
    
    
})