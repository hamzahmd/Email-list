// Using ES6 Classes

class EmailList {
  constructor(name,company,email){
    this.name = name;
    this.company = company;
    this.email = email;
  }
}

class UI {
  addEmailToList(emailList){
    const list = document.getElementById('email-list');
  
    // creating element
    const row = document.createElement('tr'); 
  
    // Inserting columns
    row.innerHTML = `
    <td>${emailList.name}</td>
    <td>${emailList.company}</td>
    <td>${emailList.email}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    // apending as a child
    list.appendChild(row);
  }

  showAlert(msg, className){
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));
  
    // Get form
    const container = document.querySelector('.container');
    // Insert alert
    const form = document.querySelector('#email-form');
    container.insertBefore(div,form);
  
    // Timeout after 2 sec
    setTimeout(function(){
      document.querySelector('.alert').remove();
    },2000);
  }

  deleteEmail(target){
    if (target.className ==='delete'){
      target.parentElement.parentElement.remove();
    }
  }

  clearFields(){
    document.getElementById('name').value = '';
    document.getElementById('company').value = '';
    document.getElementById('email').value = '';
  }
}

// Local Storage Class

class Store {
  static getEmails(){
    let emailLists;
    if(localStorage.getItem('emailLists')===null){
      emailLists =[];
    } else{
      emailLists = JSON.parse(localStorage.getItem('emailLists'));
    }
    return emailLists;
  }

  static displayEmails(){
    const emailLists = Store.getEmails();

    emailLists.forEach(function(emailList){
      const ui = new UI; 
      ui.addEmailToList(emailList);
    });  
  }

  static addEmails(emailList){
    const emailLists = Store.getEmails();
    emailLists.push(emailList);
    localStorage.setItem('emailLists',JSON.stringify(emailLists));
  }
  static removeEmails(email){
    const emailLists = Store.getEmails();

    emailLists.forEach(function(emailList,index){
      if(emailList.email ===email){
        emailLists.splice(index,1);
      }
    });  
    localStorage.setItem('emailLists',JSON.stringify(emailLists));
      
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded',Store.displayEmails);

// Event Listeners for adding emails
document.getElementById('email-form').addEventListener('submit',
  function(e){
    // Getting form values
    const name = document.getElementById('name').value,
          company = document.getElementById('company').value,
          email = document.getElementById('email').value ;
    
    // Instantiating Emaillist
    const emailList = new EmailList(name,company,email);
  
    // Instantiating UI
    const ui = new UI();
   

    // Validate
    if(name === '' || company=== '' || email=== ''){
      // Error alert
      ui.showAlert("Please fill in all fields",'error');
    }
    else{
      // Adding Email record to list 
    ui.addEmailToList(emailList);

    // Adding to LS
    Store.addEmails(emailList );

    // 
    ui.showAlert('Email Added!','success');

    ui.clearFields();
    } 
    

    e.preventDefault(); 
  });

  // Event Listener for removing email
  document.getElementById('email-list').addEventListener('click',
    function(e){

      const ui = new UI();

      ui.deleteEmail(e.target);

      // Remove from LS
      Store.removeEmails(e.target.parentElement.previousElementSibling.textContent); 
      

      ui.showAlert('Book Removed!','success');

      e.preventDefault();
    })