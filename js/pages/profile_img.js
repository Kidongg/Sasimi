import { authService, storageService } from '../firebase.js';
import {
  ref,
  uploadString,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';
import { updateProfile } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const changeProfile = async (event) => {
  event.preventDefault();
  document.getElementById('profileBtn').disabled = true;
  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );

  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem('imgDataUrl');
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, 'data_url');
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(authService.currentUser, {
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      // window.location.hash = "#home";
      window.location.reload();
    })
    .catch((error) => {
      alert(error);
    });
};

export const onFileChange = (event) => {
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('imgDataUrl', imgDataUrl);
    document.getElementById('image').src = imgDataUrl;
  };
};

///////////////////////////////////////////////////

export function openEditBoxName() {
  let name = document.getElementById('name');
  let editName = document.getElementById('editName');

  name.style.display = 'none';
  editName.style.display = 'block';
}

export function closeEditBoxName() {
  let name = document.getElementById('name');
  let editName = document.getElementById('editName');

  name.style.display = 'block';
  editName.style.display = 'none';
}

export function openEditBoxBirth() {
  let birth = document.getElementById('birth');
  let editBirth = document.getElementById('editBirth');

  birth.style.display = 'none';
  editBirth.style.display = 'block';
}

export function closeEditBoxBirth() {
  let birth = document.getElementById('birth');
  let editBirth = document.getElementById('editBirth');

  birth.style.display = 'block';
  editBirth.style.display = 'none';
}

export function openEditBoxText() {
  let text = document.getElementById('introText');
  let editText = document.getElementById('editText');

  // text.style.display='none';
  text.parentElement.remove();
  editText.style.display = 'block';
}

export function closeEditBoxText() {
  // let text = document.getElementById('text');
  let h2 = document.getElementById('h2');
  let editText = document.getElementById('editText');

  // text.style.display='block';
  h2.insertAdjacentHTML(
    'afterend',
    `<div> <div id="text">안녕하세요 ···</div></div>`
  );
  editText.style.display = 'none';
}

export function openEditBoxLeave() {
  let leave = document.getElementById('leave');
  let editLeave = document.getElementById('editLeave');

  leave.style.display = 'none';
  editLeave.style.display = 'block';
}
export function closeEditBoxLeave() {
  let leave = document.getElementById('leave');
  let editLeave = document.getElementById('editLeave');

  leave.style.display = 'block';
  editLeave.style.display = 'none';
}
