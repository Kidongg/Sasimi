import {
  doc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
  getDoc,
  where,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { dbService, authService } from '../firebase.js';

export const getBlogList = async () => {
  let blogObjList = [];
  const q = query(
    collection(dbService, 'posts'),
    orderBy('createdAt', 'desc'),
    where('creatorId', '==', authService.currentUser?.uid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const feedObj = {
      id: doc.id,
      ...doc.data(),
    };
    blogObjList.push(feedObj);
  });

  const blogList = document.getElementById('myBlog');
  const currentUid = authService.currentUser?.uid;

  blogList.innerHTML = '';

  blogObjList.forEach((blogObj) => {
    const isOwner = currentUid === blogObj.creatorId;
    const temp_html = `
        <div id="${blogObj.id}" class="card" onclick="goToPost(this)">
            <div class="cardUserInfo">
                <img class="cardProfile" title="${
                  blogObj.nickname
                }" onclick="goToProfile(this)" src="${
      blogObj.profileImg ?? '../assets/blankProfile.webp'
    }"/>
            </div>
            <div class="cardTitle" title="${blogObj.title}">
                <span class="tooltip">${blogObj.title}</span>
                ${blogObj.title}
            </div>
            <div class="cardContent">${blogObj.text}</div>
            <div class="cardDate">${new Date(blogObj.createdAt)
              .toString()
              .slice(4, 15)}</div>
      </div>
   `;
    const div = document.createElement('div');
    div.classList.add(`mycard`);
    div.innerHTML = temp_html;

    blogList.appendChild(div);
  });
};
