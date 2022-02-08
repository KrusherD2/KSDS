var tempErrorCreds;var tempProviderName;function retrieveIdToken(successCallback,errorCallback){if(firebase.auth().currentUser===null){if(errorCallback!==null)
errorCallback("User is null");return;}
firebase.auth().currentUser.getIdToken().then(function(idToken){var resultObj={token:idToken,displayName:firebase.auth().currentUser.displayName};if(successCallback!==undefined){successCallback(resultObj);}}).catch(function(error){console.log(error);if(errorCallback!==undefined)
errorCallback(error.message);});}
function anonymousLogin(successCallback,errorCallback){var resultObj={token:"",displayName:"guest"};if(successCallback!==undefined){successCallback(resultObj);}}
function firebaseLogin(providerName,successCallback,errorCallback){if(providerName==="anonymous"){anonymousLogin(successCallback,errorCallback);return;}
var user=firebase.auth().currentUser;if(user!=null&&!user.isAnonymous){retrieveIdToken(successCallback,errorCallback);return;}
var provider=getProvider(providerName);firebase.auth().useDeviceLanguage();firebase.auth().signInWithPopup(provider).then(function(result){console.log("Successful sign in");retrieveIdToken(successCallback,errorCallback);}).catch(function(error){var errorCode=error.code;var errorMessage=error.message;var email=error.email;tempErrorCreds=error.credential;console.log(error);if(errorCallback!==undefined)
errorCallback(error.message);if(errorCode==='auth/account-exists-with-different-credential'){firebase.auth().fetchSignInMethodsForEmail(email).then(function(methods){if(methods.length==0)
return;tempProviderName=methods[0].trim();setModalContent("generalModalContent","<div id =\"continueWindow\"><span class=\"close\" id=\"closeButton\" onclick=\"hideModal('generalModal')\">&times;</span><p>Please press the button to login: </p><button onclick=\"continueLogin()\">Continue Login</button></div>");showModal("generalModal");});}});}
function firebaseLogout(){firebase.auth().signOut().catch(function(error){console.log(error);});}
function getCurrentUserDisplayName(){var user=firebase.auth().currentUser;var displayName="";if(user){displayName=user.displayName;}
return displayName;}
function getProvider(providerName){if(providerName&&providerName.indexOf("facebook")!=-1)
return new firebase.auth.FacebookAuthProvider()
else
return new firebase.auth.GoogleAuthProvider()}
function setModalContent(modalContentId,contentString){content=document.getElementById(modalContentId);if(content){content.innerHTML=contentString;}}
function continueLogin(){hideModal("generalModal");var provider=getProvider(tempProviderName);firebase.auth().signInWithPopup(provider).then(function(result){if(!tempErrorCreds){return;}
result.user.linkAndRetrieveDataWithCredential(tempErrorCreds).then(function(usercred){});});}
function showModal(modalId){modal=document.getElementById(modalId);if(modal)
modal.style.display="block";}
function hideModal(modalId){modal=document.getElementById(modalId);if(modal)
modal.style.display="none";}