$(document).ready(function () {
    // 开始写 jQuery 代码...
    // let category = localStorage.getItem("category") || "all";
    // $(`.sidebar-categories li[data-category="${category}"]`).addClass("is-active");
    // const directionPanel = $(".sidebar-directory");

    $(".categories").click(function (e) {
        let target = e.target.closest('li');
        if (!target) return;

        category = $(target).data("category");
        // localStorage.setItem("category", category);

        let listPanel = $('.' + category);
        if (listPanel.is($('.hide'))) {
            listPanel.removeClass("hide").siblings().addClass("hide");
        }

        $(target).addClass("categories__item--active").siblings().removeClass("categories__item--active");
    });

});
