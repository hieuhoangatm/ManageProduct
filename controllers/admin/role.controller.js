const Role = require("../../models/roles.model.js")
const systemConfig = require("../../config/system.js")


// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nnhóm quyền",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền",
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)

    const records = await Role.create(req.body)

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await Role.findOne({
            _id: req.params.id,
            deleted: false
        })

        res.render("admin/pages/roles/edit.pug", {
            pageTitle: "Sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const data = await Role.updateOne({
            _id: req.params.id,
            deleted: false
        }, req.body)

        req.flash("success", "Cập nhật nhóm quyền thành công!")
        res.redirect(`back`)

    } catch (error) {
        req.flash("error", "Cập nhật nhóm quyền thất bại!")
        res.redirect(`${systemConfig.prefixAdmin}/roles`)

    }
}


// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        const records = await Role.find({
            deleted: false
        })

        res.render("admin/pages/roles/permissions.pug", {
            pageTitle: "Phân quyền",
            records: records
        });

    } catch (error) {
        console.log("🚀 ~ file: role.controller.js:84 ~ module.exports.permissions= ~ error:", error)
        req.flash("error", "Tải dữ liệu phân quyền thất bại!")
        res.redirect(`${systemConfig.prefixAdmin}/roles`)

    }
}

// [PATCH] /admin/roles/permissions
module.exports.permissionPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);

        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
        }

        req.flash("success", "Cập nhật phân quyền thành công!")
        res.redirect("back")

    } catch (error) {
        req.flash("error", "Phân quyền thất bại!")
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

