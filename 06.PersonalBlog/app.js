const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 配置 EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')));

// 解析表单
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
  secret: 'blog_secret',
  resave: false,
  saveUninitialized: true
}));

// 文章目录
const articlesDir = path.join(__dirname, 'articles');
if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir);

// 认证中间件
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// 读取所有文章
function getAllArticles() {
  try {
    const files = fs.readdirSync(articlesDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
        return JSON.parse(content);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('读取文章失败:', error);
    return [];
  }
}

// 生成唯一ID
function generateId() {
  return Date.now().toString();
}

// 首页
app.get('/', (req, res) => {
  const articles = getAllArticles();
  res.render('index', { 
    articles,
    title: '首页'
  });
});

// 文章页
app.get('/article/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(articlesDir, `${id}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('文章不存在');
    }
    const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.render('article', { 
      article,
      title: article.title
    });
  } catch (error) {
    console.error('读取文章失败:', error);
    res.status(500).send('服务器错误');
  }
});

// 登录页
app.get('/admin/login', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { 
    error: null,
    title: '后台登录'
  });
});

// 登录处理
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  // 硬编码用户名密码
  if (username === 'admin' && password === '123456') {
    req.session.isAuthenticated = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { 
      error: '用户名或密码错误',
      title: '后台登录'
    });
  }
});

// 登出
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// 后台首页
app.get('/admin/dashboard', requireAuth, (req, res) => {
  const articles = getAllArticles();
  res.render('admin/dashboard', { 
    articles,
    title: '后台管理'
  });
});

// 新增文章页
app.get('/admin/add', requireAuth, (req, res) => {
  res.render('admin/add', { 
    title: '新增文章'
  });
});

// 新增文章处理
app.post('/admin/add', requireAuth, (req, res) => {
  const { title, content } = req.body;
  const id = generateId();
  const article = {
    id,
    title,
    content,
    date: new Date().toISOString().split('T')[0]
  };
  
  try {
    fs.writeFileSync(path.join(articlesDir, `${id}.json`), JSON.stringify(article, null, 2));
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('保存文章失败:', error);
    res.status(500).send('保存失败');
  }
});

// 编辑文章页
app.get('/admin/edit/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const filePath = path.join(articlesDir, `${id}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('文章不存在');
    }
    const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.render('admin/edit', { 
      article,
      title: '编辑文章'
    });
  } catch (error) {
    console.error('读取文章失败:', error);
    res.status(500).send('服务器错误');
  }
});

// 编辑文章处理
app.post('/admin/edit/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const filePath = path.join(articlesDir, `${id}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('文章不存在');
    }
    
    const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    article.title = title;
    article.content = content;
    
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('更新文章失败:', error);
    res.status(500).send('更新失败');
  }
});

// 删除文章
app.post('/admin/delete/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const filePath = path.join(articlesDir, `${id}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('删除文章失败:', error);
    res.status(500).json({ success: false, error: '删除失败' });
  }
});

// 批量删除文章
app.post('/admin/batch-delete', requireAuth, (req, res) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids)) {
    return res.status(400).json({ success: false, error: '参数错误' });
  }
  
  try {
    ids.forEach(id => {
      const filePath = path.join(articlesDir, `${id}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    res.json({ success: true, deletedCount: ids.length });
  } catch (error) {
    console.error('批量删除失败:', error);
    res.status(500).json({ success: false, error: '批量删除失败' });
  }
});

app.listen(PORT, () => {
  console.log(`博客已启动：http://localhost:${PORT}`);
}); 