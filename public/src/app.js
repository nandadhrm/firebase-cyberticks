document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(user => { 
        console.log(user.uid);
    });

document.getElementById('logout').addEventListener('click', e =>{
    e.preventDefault();
    firebase.auth().signOut();
    window.location.assign('index.html');
})
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });

});


const db = firebase.database().ref('tickets');

document.getElementById('form-buy').addEventListener('submit', submitForm);
function submitForm(e){
    e.preventDefault();
    var durasiVal = document.getElementById('select-durasi').value;
    console.log(durasiVal);
    var date = new Date;
    if (durasiVal === '1') {
        var exp = (date.getDate()+1) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    }else if(durasiVal === '2'){
        var exp = (date.getDate()+7) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    }else if(durasiVal === '3'){
        var exp = date.getDate() + "/" + (date.getMonth()+2) + "/" + date.getFullYear();
    }else{
        var exp = date;
    }

    var koridor = formValue('select-koridor');
    var payment = formValue('select-payment');
    var habis = exp;
    var _user = firebase.auth().currentUser.uid;
  
    input(koridor,payment,habis,_user);
  
    document.querySelector('.sent').style.display = 'block';
  
    setTimeout(function(){
      document.querySelector('.sent').style.display = 'none';
    },3000);
  
    document.getElementById('form-buy').reset();
  }

  function formValue(id){
    return document.getElementById(id).value;
  }
  
  function input(koridor, payment, habis, _user){
    var newData = db.push();
    newData.set({
      koridor: koridor,
      payment: payment,
      exp: habis,
      _user: _user
    });
  }

  document.getElementById('btn-cancel').addEventListener('click', e =>{
    e.preventDefault();
    document.getElementById('form-buy').reset();
})

document.getElementById('editform').addEventListener('submit', event =>{
    event.preventDefault();
    var user = firebase.auth().currentUser;
    var newName = document.getElementById('newName').value;

    user.updateProfile({
      displayName: newName,
    }).then(function(){
      document.getElementById('profilePict').addEventListener('change', upload => {
        var pict = upload.target.files[0];
        var storageRef = firebase.storage().ref(user.displayName + '/' + pict.name);

        storageRef.put(pict);
      })
    })

    window.location.href='homepage.html#home'
    document.getElementById('editform').reset();
})