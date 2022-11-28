import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
  limit,
  where,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { dbService, authService } from '../firebase.js';
import { goToPost } from '../router.js';

export const savePost = async (event) => {
  event.preventDefault();
  const post = document.getElementById('writePost');
  const postTitle = document.getElementById('writeTitle');
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, 'posts'), {
      title: postTitle.value,
      text: post.value.replace(/(\n|\r\n)/g, '<br>').replace(/ /g, '&nbsp'),
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
      totalView: 0,
    });

    localStorage.clear();
    window.location.replace('#post');
    post.value = '';
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
};

export const onEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll('.postEditBtn, .postDeleteBtn');
  udBtns.forEach((udBtn) => (udBtn.disabled = 'true'));

  const postBody = event.target.parentNode.parentNode.parentNode;
  const postText = postBody.children[1].children[0];
  const postInputP = postBody.children[1].children[1];
  const udBtnGroup = event.target.parentNode;

  udBtnGroup.classList.add('noDisplay');
  postText.classList.add('noDisplay');
  postInputP.classList.add('yesDisplay');
  postInputP.classList.remove('noDisplay');
  postInputP.children[0].focus();
};

export const updatePost = async (event) => {
  event.preventDefault();
  const newPost = event.target.parentNode.children[0].value
    .replace(/(\n|\r\n)/g, '<br>')
    .replace(/ /g, '&nbsp');
  const id = event.target.parentNode.id;

  const parentNode = event.target.parentNode.parentNode;
  const postText = parentNode.children[0];
  postText.classList.remove('noDisplay');
  const postInputP = parentNode.children[1];
  postInputP.classList.remove('yesDisplay');
  postInputP.classList.add('noDisplay');

  const postRef = doc(dbService, 'posts', id);
  try {
    await updateDoc(postRef, { text: newPost });
    getPostList();
  } catch (error) {
    alert(error);
  }
};

export const deletePost = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm('해당 글을 정말 삭제하시겠습니까?');

  if (ok) {
    try {
      await deleteDoc(doc(dbService, 'posts', id));
      window.location.replace('/');
    } catch (error) {
      alert(error);
    }
  }
};

export const getPostList = async () => {
  const docID = localStorage.getItem('docID');
  const docRef = doc(dbService, 'posts', docID);
  const docSnap = await getDoc(docRef);
  const postObj = {
    id: docID,
    ...docSnap.data(),
  };
  const postList = document.getElementById('postList');
  const currentUid = authService.currentUser?.uid;
  postList.innerHTML = '';
  const isOwner = currentUid === postObj.creatorId;
  const temp_html = `<div class="postWrap" id="${postObj.id}">
                        <div class="postTitle">
                          <h2>${postObj.title}</h2>
                          <span class="postDate">${new Date(postObj.createdAt)
                            .toString()
                            .slice(0, 25)}</span>
                        </div>
                        <div class="postDesc">
                          <p>
                            ${postObj.text}
                          </p>
                          <p id="${postObj.id}" class="noDisplay">
                                <textarea class="writePost" placeholder="제목" id="post">${
                                  postObj.text
                                }</textarea><button class="updateBtn btn" onclick="updatePost(event)">완료</button></p>
                        </div>
                        <div class="postProfile">
                          <img class="profileImg" width="50px" height="50px" src="${
                            postObj.profileImg ?? '/assets/blankProfile.webp'
                          }" alt="profileImg" />
                          <span class="profileName">${
                            postObj.nickname ?? '닉네임 없음'
                          }</span>
                          <div class=" ${
                            isOwner ? 'postChangeGroup' : 'noDisplay'
                          }">
                            <button class="postEditBtn postBtn" onclick="onEditing(event)">수정</button>
                            <button name="${
                              postObj.id
                            }" class="postDeleteBtn postBtn" onclick="deletePost(event)">삭제</button>
                          </div>
                        </div>
                      </div>`;
  const div = document.createElement('div');
  div.classList.add('myPost');
  div.innerHTML = temp_html;
  postList.appendChild(div);
};

export const getMyPost = async () => {
  let postObjList = [];
  const q = query(
    collection(dbService, 'posts'),
    orderBy('createdAt', 'desc'),
    where('creatorId', '==', authService.currentUser?.uid),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const postObj = {
      id: doc.id,
      ...doc.data(),
    };
    postObjList.push(postObj);
  });
  localStorage.setItem('docID', postObjList[0].id);
  const postList = document.getElementById('postList');
  const currentUid = authService.currentUser?.uid;
  postList.innerHTML = '';

  postObjList.forEach((postObj) => {
    const isOwner = currentUid === postObj.creatorId;
    const temp_html = `<div class="postWrap">
                        <div class="postTitle">
                          <h2>${postObj.title}</h2>
                        </div>
                        <div class="postDesc">
                          <p>
                            ${postObj.text}
                          </p>
                          <p id="${postObj.id}" class="noDisplay">
                                <textarea class="writePost" placeholder="제목" id="post">${
                                  postObj.text
                                }</textarea><button class="updateBtn btn" onclick="updatePost(event)">완료</button></p>
                          <span class="postDate">${new Date(postObj.createdAt)
                            .toString()
                            .slice(0, 25)}</span>
                        </div>
                        <div class="postProfile">
                          <img class="cmtImg profileImg" width="50px" height="50px" src="${
                            postObj.profileImg ?? '/assets/blankProfile.webp'
                          }" alt="profileImg" />
                          <span class="profileName">${
                            postObj.nickname ?? '닉네임 없음'
                          }</span>
                          <div class=" ${
                            isOwner ? 'postChangeGroup' : 'noDisplay'
                          }">
                            <button class="postEditBtn postBtn" onclick="onEditing(event)">수정</button>
                            <button name="${
                              postObj.id
                            }" class="postDeleteBtn postBtn" onclick="deletePost(event)">삭제</button>
                          </div>
                        </div>
                      </div>`;

    const div = document.createElement('div');
    div.classList.add('myPost');
    div.innerHTML = temp_html;
    postList.appendChild(div);
  });
};

export const updateView = async () => {
  const docID = localStorage.getItem('docID');
  const docRef = doc(dbService, 'posts', docID);
  const docSnap = await getDoc(docRef);
  const forUpdate = {
    ...docSnap.data(),
  };
  let curView = ++forUpdate.totalView;
  try {
    await updateDoc(docRef, { totalView: curView });
  } catch (error) {
    alert(error);
  }
};

//comment

export const save_comment = async (event) => {
  event.preventDefault();
  const comment = document.getElementById('comment');
  const { uid, photoURL, displayName } = authService.currentUser;
  const docID = localStorage.getItem('docID');
  try {
    await addDoc(collection(dbService, 'comments'), {
      text: comment.value.replace(/(\n|\r\n)/g, '<br>').replace(/ /g, '&nbsp'),
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
      docID: docID,
    });
    comment.value = '';
    getCommentList();
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
};

export const commentEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll('.editBtn, .deleteBtn');
  udBtns.forEach((udBtn) => (udBtn.disabled = 'true'));

  const cardBody = event.target.parentNode.parentNode;
  const commentText = cardBody.children[0];
  const commentInputP = cardBody.children[1];
  const udBtnGroup = event.target.parentNode;

  commentText.classList.add('noDisplay');
  udBtnGroup.classList.add('noDisplay');
  commentInputP.classList.add('yesDisplay');
  commentInputP.classList.remove('noDisplay');
  commentInputP.children[0].focus();
};

export const update_comment = async (event) => {
  event.preventDefault();
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;

  const parentNode = event.target.parentNode.parentNode;
  const commentText = parentNode.children[0];
  commentText.classList.remove('noDisplay');
  const commentInputP = parentNode.children[1];
  commentInputP.classList.remove('yesDisplay');
  commentInputP.classList.add('noDisplay');

  const commentRef = doc(dbService, 'comments', id);
  try {
    await updateDoc(commentRef, { text: newComment });
    getCommentList();
  } catch (error) {
    alert(error);
  }
};

export const delete_comment = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm('해당 응원글을 정말 삭제하시겠습니까?');
  if (ok) {
    try {
      await deleteDoc(doc(dbService, 'comments', id));
      getCommentList();
    } catch (error) {
      alert(error);
    }
  }
};

export const getCommentList = async () => {
  let cmtObjList = [];
  const docID = localStorage.getItem('docID');
  const q = query(
    collection(dbService, 'comments'),
    orderBy('createdAt'),
    where('docID', '==', docID)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
  });
  const commnetList = document.getElementById('comment-list');
  const currentUid = authService.currentUser?.uid;
  commnetList.innerHTML = '';
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="commentListWrap">
          <div class="commentCardBody">
              <div class="commentCard">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${
                    cmtObj.id
                  }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" value="${
      cmtObj.text
    }"/><button class="updateBtn btn" onclick="update_comment(event)">완료</button></p>
                  <footer class="comment-footer"><div><img class="cmtImg" width="50px" height="50px" src="${
                    cmtObj.profileImg ?? '/assets/blankProfile.webp'
                  }" alt="profileImg" /><span>${
      cmtObj.nickname ?? '닉네임 없음'
    }</span></div><div class="cmtAt">${new Date(cmtObj.createdAt)
      .toString()
      .slice(0, 25)}</div></footer>
      <div class="${isOwner ? 'updateBtns' : 'noDisplay'}">
           <button onclick="commentEditing(event)" class="editBtn btn btn-dark">수정</button>
        <button name="${
          cmtObj.id
        }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark">삭제</button>
      </div>            
              </div>
            </div>
     </div>`;
    const div = document.createElement('div');
    div.classList.add('mycards');
    div.innerHTML = temp_html;
    commnetList.appendChild(div);
  });
};
