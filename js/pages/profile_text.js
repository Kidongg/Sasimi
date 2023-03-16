import {
  addDoc,
  collection,
  orderBy,
  query,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "../firebase.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

export const saveName = async (event) => {
  event.preventDefault();
  const newName = document.getElementById("nameComment").value;
  await updateProfile(authService.currentUser, {
    displayName: newName ? newName : null,
  })
    .then(() => {
      closeEditBoxName();
      document.getElementById("nameText").innerHTML =
        authService.currentUser.displayName ?? "이름을 입력해주세요";
    })
    .catch((error) => {
      alert(error);
    });
};

export const getName = async () => {
  let userName = authService.currentUser.displayName;
  document.getElementById("nameText").innerHTML =
    userName ?? "이름을 입력해주세요";
};

export const saveBirth = async (event) => {
  event.preventDefault();
  const comment = document.getElementById("birthComment");
  console.log(comment);
  const { uid } = authService.currentUser;
  try {
    await addDoc(collection(dbService, "birth"), {
      birth: comment.value,
      creatorId: uid,
      createdAt: new Date(),
    });
    closeEditBoxBirth();
    getBirth();
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};

export const saveText = async (event) => {
  event.preventDefault();
  const comment = document.getElementById("textComment");
  const { uid } = authService.currentUser;
  try {
    await addDoc(collection(dbService, "text"), {
      text: comment.value,
      creatorId: uid,
      createdAt: new Date(),
    });
    closeEditBoxText();
    window.location.reload();
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};

export let userBirth;
export const getBirth = async () => {
  let birthObjList = [];
  const q = query(
    collection(dbService, "birth"),
    orderBy("createdAt", "desc"),
    where("creatorId", "==", authService.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const birthObj = {
      id: doc.id,
      ...doc.data(),
    };
    birthObjList.push(birthObj);
  });
  userBirth = birthObjList[0].birth;
  document.getElementById("birthText").innerHTML =
    userBirth ?? "출생년도를 입력해주세요";
};

export let userText;
export const getText = async () => {
  let textObjList = [];
  const q = query(
    collection(dbService, "text"),
    orderBy("createdAt", "desc"),
    where("creatorId", "==", authService.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const textObj = {
      id: doc.id,
      ...doc.data(),
    };
    textObjList.push(textObj);
  });
  userText = textObjList[0].text;
  document.getElementById("introText").innerHTML =
    userText ?? "자기소개를 입력해주세요";
};
