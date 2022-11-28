import {
  doc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { dbService, authService } from '../firebase.js';

// 로딩스피너
export function loadingSpinner() {
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loadingSpinner');

    loader.classList.add('loadingSpinnerHidden');

    loader.addEventListener('transitionend', () => {
      document.body.removeChild('loadingSpinner');
    });
  });
}

// 내 게시글에만 보이는 메뉴 버튼 드롭다운 기능
export function cardMenu(idx) {
  console.log(idx);
  document.getElementById(`cardDropdown${idx}`).classList.toggle('show');
}

window.onclick = function (event) {
  if (!event.target.matches('.cardDropdownBtn')) {
    var dropdowns = document.getElementsByClassName('cardDropdownContent');
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// 피드 불러오기
export const getFeedList = async () => {
  let feedObjList = [];
  const q = query(collection(dbService, 'posts'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const feedObj = {
      id: doc.id,
      ...doc.data(),
    };
    feedObjList.push(feedObj);
  });

  const feedList = document.getElementById('feed');
  const currentUid = authService.currentUser?.uid;

  feedList.innerHTML = '';
  feedObjList.forEach((feedObj, idx) => {
    const isOwner = currentUid === feedObj.creatorId;
    const temp_html = `
        <div id="${feedObj.id}" class="card" onclick="goToPost(this)">
            <div class="cardUserInfo">
                <img class="cardProfile" title="${
                  feedObj.nickname
                }" onclick="goToProfile(this)" src="${
      feedObj.profileImg ?? '../assets/blankProfile.webp'
    }"/>
                <div class="${isOwner ? 'delete' : 'noDisplay'}">
                    <a name="${
                      feedObj.id
                    }" onclick="deleteFeed(event)" class="deleteBtn">del</a>
                </div>
            </div>
            <div class="cardTitle" title="${feedObj.title}">
                <span class="tooltip">${feedObj.title}</span>
                ${feedObj.title}
            </div>
            <div class="cardContent">${feedObj.text}</div>
            <div class="cardDate">${new Date(feedObj.createdAt)
              .toString()
              .slice(4, 15)}</div>
      </div>
   `;
    const div = document.createElement('div');
    div.classList.add(`mycard`);
    div.innerHTML = temp_html;
    feedList.appendChild(div);

    // 더보기 버튼
    const loadmore = document.querySelector('.loadmore');
    const elementList = [...document.querySelectorAll('.feed .mycard')];
    let currentItems = 12;

    // 게시글 12개 이하일 때 더보기 감추기
    if (currentItems >= elementList.length) {
      loadmore.classList.add('loaded');
    } else {
      loadmore.classList.remove('loaded');
    }

    // console.log(
    //   '기준:',
    //   currentItems,
    //   '/',
    //   '피드 카드 갯수:',
    //   elementList.length
    // );

    // 게시글 12개 초과시 더보기 보여주기
    loadmore.addEventListener('click', (e) => {
      e.target.classList.add('showLoader');

      for (let i = currentItems; i < currentItems + 12; i++) {
        e.target.classList.remove('showLoader');
        if (elementList[i]) {
          elementList[i].style.display = 'flex';
        }
      }
      currentItems += 12;
      // console.log(
      //   '더보기:',
      //   currentItems,
      //   '/',
      //   '피드 카드 갯수:',
      //   elementList.length
      // );

      // 게시글 끝까지 로딩시 더보기 감추기
      if (currentItems >= elementList.length) {
        e.target.classList.add('loaded');
      }
    });
  });
};

// 내 게시글 삭제하기
export const deleteFeed = async (event) => {
  event.preventDefault();
  event.stopPropagation();
  const id = event.target.name;
  const ok = window.confirm('정말 삭제하시겠습니까?🥺');
  if (ok) {
    try {
      await deleteDoc(doc(dbService, 'posts', id));
      getFeedList();
      console.log('피드에서 게시글 삭제 성공');
    } catch (error) {
      alert(error);
      console.log('피드에서 게시글 삭제 실패');
    }
  }
};
