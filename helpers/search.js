module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    }

    if (query.keyword) {
        objectSearch.keyword = query.keyword;    // Cập nhật lại keyword
        objectSearch.regex = new RegExp(objectSearch.keyword, "i");       // ⭐regex
    }

    return objectSearch;
}