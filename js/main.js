import { handleAuth, logout, socialLogin, Toggled } from "./pages/login.js";
import { getBlogList } from "./pages/blog.js";
import { handleLocation, goToProfile, goToPost } from "./router.js";
import { authService } from "./firebase.js";
import {
  loadingSpinner,
  cardMenu,
  getFeedList,
  deleteFeed,
} from "./pages/feed.js";
import {
  openEditBoxName,
  closeEditBoxName,
  openEditBoxBirth,
  closeEditBoxBirth,
  openEditBoxText,
  closeEditBoxText,
  changeProfile,
  onFileChange,
  openEditBoxLeave,
  closeEditBoxLeave,
} from "./pages/profile_img.js";
import {
  saveName,
  saveBirth,
  saveText,
  getBirth,
  userBirth,
  getText,
  userText,
} from "./pages/profile_text.js";
import { leave } from "./pages/deleteUser.js";
import {
  savePost,
  updatePost,
  onEditing,
  deletePost,
  getPostList,
  getMyPost,
  updateView,
  save_comment,
  update_comment,
  commentEditing,
  delete_comment,
} from "./pages/newPost.js";

// url 바뀌면 handleLocation 실행하여 화면 변경
window.addEventListener("hashchange", handleLocation);

// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener("DOMContentLoaded", function () {
  // Firebase 연결상태를 감시
  authService.onAuthStateChanged((user) => {
    // Firebase 연결되면 화면 표시
    handleLocation();
    const hash = window.location.hash;
    let ulElementBeforeLogin = document.querySelector(".navbarBeforeLogin");
    let ulElementAfterLogin = document.querySelector(".navbarUserAccountMenu");

    const postBtn = document.getElementById("newPost");
    // 로그인 여부
    if (user) {
      if (hash === "#login") {
        window.location.replace("");
      }
    } else {
      console.log("로그아웃");
      postBtn.style.display = "none";
    }
  });
});
// 드롭다운 버튼 외부의 영역 클릭 시 사라지게
window.addEventListener("mouseup", function (event) {
  const dropDown = this.document.querySelector("#dropDown");

  const mobileDropdown = this.document.querySelector(".mobileDropdownContent");
  if (!dropDown.contains(event.target)) {
    const dropdown1 = this.document.querySelector(".navbarUserAccountMenu");
    const dropdown2 = this.document.querySelector(".navbarBeforeLogin");
    dropdown1.classList.remove("active");
    dropdown2.classList.remove("active");
  }
});

// type=module, 모듈객체는 지역적으로 밖에 사용 불가. 따라서 윈도우객체에 할당함으로써 전역적으로 사용 가능해짐
// onclick, onchange, onsubmit 이벤트 핸들러 리스트

window.handleAuth = handleAuth;
window.goToProfile = goToProfile;
window.socialLogin = socialLogin;
window.logout = logout;
window.Toggled = Toggled;
// 탈퇴
window.leave = leave;
window.openEditBoxLeave = openEditBoxLeave;
window.closeEditBoxLeave = closeEditBoxLeave;
// 시윤님
window.getFeedList = getFeedList;
window.savePost = savePost;
window.deleteFeed = deleteFeed;
window.cardMenu = cardMenu;
window.loadingSpinner = loadingSpinner;

// 기동님
window.openEditBoxName = openEditBoxName;
window.closeEditBoxName = closeEditBoxName;
window.openEditBoxBirth = openEditBoxBirth;
window.closeEditBoxBirth = closeEditBoxBirth;
window.openEditBoxText = openEditBoxText;
window.closeEditBoxText = closeEditBoxText;

window.onFileChange = onFileChange;
window.changeProfile = changeProfile;

window.saveName = saveName;
window.saveBirth = saveBirth;
window.saveText = saveText;
window.getBirth = getBirth;
window.userBirth = userBirth;
window.getText = getText;
window.userText = userText;

//post
window.goToPost = goToPost;
window.savePost = savePost;
window.updatePost = updatePost;
window.onEditing = onEditing;
window.deletePost = deletePost;
window.getPostList = getPostList;
window.getMyPost = getMyPost;
window.save_comment = save_comment;
window.update_comment = update_comment;
window.commentEditing = commentEditing;
window.delete_comment = delete_comment;
window.getBlogList = getBlogList;
