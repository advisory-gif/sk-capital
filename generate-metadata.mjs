import fs from 'node:fs';
const pages=JSON.parse(fs.readFileSync('src/page-metadata.json','utf8'));
const source=fs.readFileSync('dist/index.html','utf8');
for(const [route,[heading,description]] of Object.entries(pages)){
 const title=heading+' | SK Capital',url='https://www.skcapital.co.in'+(route==='/'?'/':route);
 let html=source.replace(/<title>[\s\S]*?<\/title>/,'<title>'+title+'</title>');
 html=html.replace(/<meta\s+(?:name|property)="(title|description|og:title|og:description|twitter:title|twitter:description|og:url|twitter:url)"\s+content="[^"]*"\s*\/>/g,(tag,key)=>tag.replace(/content="[^"]*"/,'content="'+(key.endsWith('url')?url:key.endsWith('description')?description:title)+'"'));
 html=html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/,'<link rel="canonical" href="'+url+'" />');
 if(process.env.VERCEL_ENV && process.env.VERCEL_ENV!=='production') html=html.replace('index, follow','noindex, nofollow');
 const dir=route==='/'?'dist':'dist'+route;fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(dir+'/index.html',html);
}
fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).map(p=>'<url><loc>https://www.skcapital.co.in'+p+'</loc></url>').join('')+'</urlset>');
fs.writeFileSync('dist/robots.txt',process.env.VERCEL_ENV && process.env.VERCEL_ENV!=='production'?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://www.skcapital.co.in/sitemap.xml\n');
