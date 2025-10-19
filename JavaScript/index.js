document.addEventListener('DOMContentLoaded', () => {
    // 折叠 / 展开父项
    document.querySelectorAll('.parent').forEach(btn => {
        btn.addEventListener('click', () => {
            const sub = btn.nextElementSibling;
            if (!sub) return;
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            sub.classList.toggle('hidden');
        });
    });

    // 点击子项刷新右侧内容
    function showContent(title, body){
        const t = document.getElementById('content-title');
        const b = document.getElementById('content-body');
        if(t) t.textContent = title;
        if(b) b.textContent = body;
    }

    document.querySelectorAll('.child').forEach(ch => {
        ch.addEventListener('click', (e) => {
            const title = ch.dataset.title || ch.textContent;
            const content = ch.dataset.content || '';
            showContent(title, content);
            // 可选：高亮当前选中子项
            document.querySelectorAll('.child').forEach(c => c.classList.remove('active'));
            ch.classList.add('active');
        });
    });
});
