import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { authService } from "../firebase.js";

export const leave = async (event) => {
  event.preventDefault();
  if (
    window.confirm(
      "정말 탈퇴하시겠습니까? 탈퇴 후에도 내가 쓴 게시물은 계속 남아있습니다."
    )
  ) {
    console.log("user 탈퇴");

    // 인풋 태그 가져옴
    let userProvidedPassword = document.getElementById("passwordText").value;
    const credential = EmailAuthProvider.credential(
      authService.currentUser.email,
      userProvidedPassword
    );

    const result = await reauthenticateWithCredential(
      authService.currentUser,
      credential
    );

    await deleteUser(result.user)
      .then(() => {
        console.log("유저 삭제 완료");
        localStorage.removeItem("user");
        window.location.replace("");
      })
      .catch((error) => {
        const errorMessage2 = error.message;
        console.log("error:", errorMessage2);
      });
  } else {
    console.log("탈퇴 취소");
  }
};
