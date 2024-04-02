// Button Status  => những thuộc tính tự định nghĩa khi dùng querySelectorAll thì phải thêm dấu ngoặc vuông [] vào
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  // let url = window.location.href   => Lấy ra url của trang web hiện tại
  // console.log(url);
  // hàm URL() dùng để thêm key hay params trên này dùng để thay đổi params
  let url = new URL(window.location.href); // => Lấy ra url của trang web hiện tại

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status"); // LẤy ra status hiện tại của button

      if (status) {
        url.searchParams.set("status", status); // Xét lại params cho URL
      } else {
        url.searchParams.delete("status");
      }

      console.log(url.href);
      window.location.href = url.href; // Chuyển hướng trang sang params mới
    });
  });
}
// End Button Status

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href); // => Lấy ra url của trang web hiện tại

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn sự kiện load lại trang web
    const keyword = e.target.elements.keyword.value;
    // console.log(keyword);

    if (keyword) {
      url.searchParams.set("keyword", keyword); // Xét lại params cho URL
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href; // Chuyển hướng trang sang params mới
  });
}
// End Form search

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination");
if (buttonPagination) {
  let url = new URL(window.location.href); // => Lấy ra url của trang web hiện tại

  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);
      window.location.href = url.href; // Chuyển hướng trang sang params mới
    });
  });
}
// End Pagination

// CheckBox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  console.log(checkboxMulti);
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkAll']");
  const inputId = checkboxMulti.querySelectorAll("input[name='id']");
  console.log("h" + inputId);
  console.log("i" + inputCheckAll);
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      console.log("hihi");
      inputId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputId.forEach((input) => {
        input.checked = false;
      });
      console.log("hihiii");
    }
  });

  inputId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked == inputId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// End CheckBox Multi

// Form change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;
    console.log(typeChange);
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này ?");

      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi !!!");
    }
  });
}
// End form change Multi

// Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// end alert


// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  console.log(uploadImagePreview);
  uploadImageInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const image = URL.createObjectURL(e.target.files[0]);

      uploadImagePreview.src = image;
    }
  });
}
// End Upload Image