document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. 数据源 (模拟后端 API)
    // ==========================================
    
    // 宠物数据
    const petsData = [
        {
            id: 1, name: "豆豆", type: "dog", age: "baby", gender: "female", breed: "中华田园犬",
            location: "北京爱心驿站",
            desc: "非常亲人，喜欢玩球，已完成驱虫。它是在一个雨夜被救助的，现在非常健康。",
            img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2, name: "咪咪", type: "cat", age: "adult", gender: "male", breed: "橘猫",
            location: "广州领养中心",
            desc: "性格安静，有点贪吃，适合新手领养。只要有罐头，它就是你最好的朋友。",
            img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3, name: "旺财", type: "dog", age: "senior", gender: "male", breed: "金毛",
            location: "上海阳光之家",
            desc: "温柔的大暖男，受过训练，不拆家。年纪稍大，但非常懂事，希望能找个安稳的家。",
            img: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 4, name: "雪球", type: "cat", age: "baby", gender: "female", breed: "白猫",
            location: "北京爱心驿站",
            desc: "活泼好动，对世界充满好奇。拥有异色瞳，非常漂亮，需要主人多陪它玩耍。",
            img: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 5, name: "黑糖", type: "dog", age: "adult", gender: "female", breed: "拉布拉多",
            location: "广州领养中心",
            desc: "极其聪明，喜欢游泳，需要运动量。如果你喜欢户外运动，它是完美的伙伴。",
            img: "https://tse3-mm.cn.bing.net/th/id/OIP-C.RXg8kpNndV56NFj8wARR7AHaEO?w=303&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
        },
        {
            id: 6, name: "花卷", type: "cat", age: "adult", gender: "female", breed: "狸花猫",
            location: "四川绵阳救助站",
            desc: "捕鼠小能手，独立但也粘人。典型的中华田园猫，身体素质极好。",
            img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
    ];

    // 机构地点数据
    const locationsData = [
        { id: 1, name: "北京爱心驿站", city: "bj", address: "北京市朝阳区青年路123号", count: 12, top: "40%", left: "65%" },
        { id: 2, name: "四川绵阳救助站", city: "sh", address: "四川省绵阳市涪城区", count: 25, top: "60%", left: "55%" }, // 模拟地图位置
        { id: 3, name: "广州领养中心", city: "gz", address: "广州市天河区花城大道", count: 30, top: "75%", left: "60%" },
        { id: 4, name: "上海阳光之家", city: "sh", address: "上海市浦东新区", count: 18, top: "55%", left: "75%" }
    ];

    // ==========================================
    // 2. 核心功能：UI 渲染与交互
    // ==========================================

    const petsContainer = document.getElementById('pets-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const ageSelect = document.getElementById('age-filter');
    const searchInput = document.getElementById('search-input');
    
    // 初始化状态
    let currentFilters = {
        type: 'all',
        age: 'all',
        search: ''
    };

    /**
     * 渲染宠物卡片
     * @param {Array} pets - 宠物数据数组
     */
    function renderPets(pets) {
        petsContainer.innerHTML = '';
        
        // 增加淡入动画类
        petsContainer.style.opacity = '0';
        setTimeout(() => petsContainer.style.opacity = '1', 50);

        if (pets.length === 0) {
            petsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 40px; color:#888;">
                    <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom:10px;"></i>
                    <p>没有找到符合条件的毛孩子，换个筛选条件试试？</p>
                </div>
            `;
            return;
        }

        pets.forEach(pet => {
            const genderClass = pet.gender === 'male' ? 'male' : 'female';
            const genderIcon = pet.gender === 'male' ? '<i class="fa-solid fa-mars"></i>' : '<i class="fa-solid fa-venus"></i>';
            const ageText = formatAge(pet.age);
            
            const card = document.createElement('div');
            card.className = 'pet-card';
            // 添加 data-id 方便后续查找
            card.dataset.id = pet.id; 
            
            card.innerHTML = `
                <div class="pet-img">
                    <span class="pet-tag">${pet.breed}</span>
                    <img src="${pet.img}" alt="${pet.name}" loading="lazy">
                </div>
                <div class="pet-info">
                    <h3>${pet.name} <span class="gender ${genderClass}">${genderIcon}</span></h3>
                    <div class="pet-meta">
                        <span><i class="fa-regular fa-clock"></i> ${ageText}</span> | 
                        <span><i class="fa-solid fa-location-dot"></i> ${pet.location}</span>
                    </div>
                    <p class="pet-desc">${pet.desc}</p>
                    <button class="btn btn-view-detail" data-id="${pet.id}">查看详情</button>
                </div>
            `;
            petsContainer.appendChild(card);
        });

        // 重新绑定详情按钮事件
        document.querySelectorAll('.btn-view-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const petId = parseInt(e.target.dataset.id);
                openPetModal(petId);
            });
        });
    }

    function formatAge(ageType) {
        const map = { 'baby': '幼年(0-1岁)', 'adult': '成年(1-8岁)', 'senior': '老年(8岁+)' };
        return map[ageType] || ageType;
    }

    // ==========================================
    // 3. 筛选与搜索逻辑 (Smart Search)
    // ==========================================

    function applyFilters() {
        const filtered = petsData.filter(pet => {
            const typeMatch = currentFilters.type === 'all' || pet.type === currentFilters.type;
            const ageMatch = currentFilters.age === 'all' || pet.age === currentFilters.age;
            
            // 模糊搜索：匹配名字、品种或描述
            const term = currentFilters.search.toLowerCase();
            const searchMatch = !term || 
                                pet.name.toLowerCase().includes(term) || 
                                pet.breed.toLowerCase().includes(term) ||
                                pet.desc.toLowerCase().includes(term);
            
            return typeMatch && ageMatch && searchMatch;
        });
        renderPets(filtered);
    }

    // 事件监听：类型按钮
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.type = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    // 事件监听：年龄下拉
    ageSelect.addEventListener('change', (e) => {
        currentFilters.age = e.target.value;
        applyFilters();
    });

    // 事件监听：搜索框 (防抖处理 - 性能优化)
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            currentFilters.search = e.target.value.trim();
            applyFilters();
        }, 300); // 300ms 后再执行筛选，避免用户每打一个字都重绘
    });

    // ==========================================
    // 4. Modal 模态框系统 (自定义弹窗)
    // ==========================================
    
    const modalOverlay = document.getElementById('modal-overlay');
    const modalInnerContent = document.getElementById('modal-inner-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function openModal(contentHtml) {
        modalInnerContent.innerHTML = contentHtml;
        modalOverlay.classList.remove('hidden');
        // 稍微延迟添加 active 类以触发 CSS transition
        setTimeout(() => modalOverlay.classList.add('active'), 10);
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300); // 等待动画结束
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // 打开宠物详情 Modal
    function openPetModal(petId) {
        const pet = petsData.find(p => p.id === petId);
        if (!pet) return;

        const html = `
            <img src="${pet.img}" class="modal-pet-img" alt="${pet.name}">
            <h2 style="margin-bottom:10px; color:var(--primary-color);">${pet.name} <span style="font-size:0.6em; color:#888;">(${pet.breed})</span></h2>
            <div class="modal-detail-row"><span class="modal-label">性别:</span> ${pet.gender === 'male' ? '男生' : '女生'}</div>
            <div class="modal-detail-row"><span class="modal-label">年龄:</span> ${formatAge(pet.age)}</div>
            <div class="modal-detail-row"><span class="modal-label">所在地:</span> ${pet.location}</div>
            <p style="margin: 15px 0; color:#555; line-height:1.6;">${pet.desc}</p>
            <div style="margin-top:25px; text-align:right;">
                <button class="btn btn-outline" style="color:#666; border-color:#ddd; margin-right:10px;" onclick="document.getElementById('modal-close-btn').click()">再看看</button>
                <button class="btn btn-primary" id="confirm-adopt-btn">申请领养</button>
            </div>
        `;
        openModal(html);

        // 绑定模态框内的按钮事件
        document.getElementById('confirm-adopt-btn').addEventListener('click', () => {
            closeModal();
            showToast(`已提交对 ${pet.name} 的领养申请！志愿者会尽快联系您。`, 'success');
        });
    }

    // 打开登录 Modal
    document.getElementById('login-btn').addEventListener('click', () => {
        const html = `
            <h2 style="text-align:center; margin-bottom:20px;">欢迎回家</h2>
            <div class="modal-form-group">
                <label>手机号 / 邮箱</label>
                <input type="text" placeholder="请输入您的账号">
            </div>
            <div class="modal-form-group">
                <label>密码</label>
                <input type="password" placeholder="请输入密码">
            </div>
            <button class="btn btn-primary" style="width:100%; margin-top:10px;" onclick="handleLogin()">登录</button>
            <p style="text-align:center; margin-top:15px; font-size:0.9rem; color:#888;">还没有账号？ <a href="#" style="color:var(--primary-color);">立即注册</a></p>
        `;
        openModal(html);
    });

    // 模拟登录处理需要挂载到 window 或者在内部处理
    window.handleLogin = function() {
        closeModal();
        showToast('登录成功！欢迎回到暖爪公益。', 'success');
        document.querySelector('.btn-login').innerHTML = '<i class="fa-solid fa-user-check"></i> 我的账户';
    };

    // ==========================================
    // 5. Toast 消息通知系统
    // ==========================================

    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
        
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        // 动画入场
        setTimeout(() => toast.classList.add('show'), 100);

        // 3秒后移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ==========================================
    // 6. 动态地图与列表
    // ==========================================

    const mapMarkersContainer = document.getElementById('map-markers-container');
    const listViewContainer = document.getElementById('list-view');

    function renderLocations() {
        // 1. 渲染地图点
        mapMarkersContainer.innerHTML = locationsData.map(loc => `
            <div class="map-marker" style="top: ${loc.top}; left: ${loc.left};" onclick="showToast('已定位到：${loc.name}', 'info')">
                <i class="fa-solid fa-location-dot"></i>
                <div class="marker-info">
                    <strong>${loc.name}</strong>
                    <p>待领养: ${loc.count}只</p>
                </div>
            </div>
        `).join('');

        // 2. 渲染列表
        listViewContainer.innerHTML = locationsData.map(loc => `
            <div class="location-item">
                <div class="loc-info">
                    <h4>${loc.name}</h4>
                    <p><i class="fa-solid fa-location-arrow"></i> ${loc.address}</p>
                </div>
                <div class="loc-action">
                    <span>待领养: ${loc.count}</span>
                    <button class="btn-sm" onclick="showToast('正在为您导航至 ${loc.name}...', 'success')">导航</button>
                </div>
            </div>
        `).join('');
    }

    // 视图切换逻辑
    const btnMapView = document.getElementById('btn-map-view');
    const btnListView = document.getElementById('btn-list-view');
    const mapView = document.getElementById('map-view');
    const listView = document.getElementById('list-view');

    btnMapView.addEventListener('click', () => {
        btnMapView.classList.add('active');
        btnListView.classList.remove('active');
        mapView.classList.add('active');
        listView.classList.remove('active');
    });

    btnListView.addEventListener('click', () => {
        btnListView.classList.add('active');
        btnMapView.classList.remove('active');
        listView.classList.add('active');
        mapView.classList.remove('active');
    });

    // ==========================================
    // 7. 其他交互 (捐款、滚动、数字增长)
    // ==========================================

    // 捐款按钮逻辑
    const donateBtns = document.querySelectorAll('.donate-btn');
    donateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            donateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('do-donate-btn').addEventListener('click', () => {
        const activeBtn = document.querySelector('.donate-btn.active');
        const amount = activeBtn ? activeBtn.innerText : '自定义金额';
        showToast(`感谢您的爱心！准备捐赠 ${amount}`, 'success');
    });

    // 移动端菜单
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    mobileToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    // 数字增长动画 (Counter Animation)
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    function startCounterAnimation() {
        if (hasAnimated) return; // 只运行一次
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 动画持续2秒
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
        hasAnimated = true;
    }

    // 监听滚动，当 Hero 区域进入视野时触发动画
    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            startCounterAnimation();
        }
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.hero-stats'));

    // 导航栏滚动阴影效果
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 初始化渲染
    renderPets(petsData);
    renderLocations();
});