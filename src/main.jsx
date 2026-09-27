import React, {useEffect, useMemo, useState} from "react";
import { createRoot } from "react-dom/client";
import { Search, ShoppingBag, Heart, User, Menu, X, Plus, Pencil, Trash2, Package, LayoutDashboard, LogOut, ChevronRight } from "lucide-react";
import "./styles.css";

const starterProducts = [
  {id:1,name:"Elegant Gold Necklace",category:"Jewellery",price:899,oldPrice:1299,stock:12,image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",description:"Elegant everyday necklace for festive and casual looks.",sizes:["Free Size"],colors:["Gold"],newArrival:true,bestSeller:true},
  {id:2,name:"Classic Black Burqa",category:"Burqa",price:1499,oldPrice:1899,stock:8,image:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",description:"Comfortable modest wear with a clean premium finish.",sizes:["M","L","XL"],colors:["Black"],newArrival:true},
  {id:3,name:"Premium Hijab",category:"Hijab",price:499,oldPrice:699,stock:25,image:"https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",description:"Soft and lightweight hijab for everyday styling.",sizes:["Free Size"],colors:["Black","Maroon","Beige"],bestSeller:true},
  {id:4,name:"Ladies Fashion Bag",category:"Bags",price:799,oldPrice:1099,stock:10,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",description:"Stylish daily-use handbag with spacious interior.",sizes:["Standard"],colors:["Black","Brown"]},
  {id:5,name:"Pearl Earrings",category:"Jewellery",price:349,oldPrice:499,stock:30,image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",description:"Minimal pearl earrings for a graceful finish.",sizes:["Free Size"],colors:["Pearl"],newArrival:true},
  {id:6,name:"Printed Fashion Scarf",category:"Accessories",price:299,oldPrice:399,stock:18,image:"https://images.unsplash.com/photo-1601924928375-9c8c5b0d0f0e?auto=format&fit=crop&w=800&q=80",description:"Lightweight printed scarf for versatile styling.",sizes:["Free Size"],colors:["Multi"]},
];

const cats=["All","Jewellery","Burqa","Hijab","Bags","Fashion","Accessories"];

function load(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }

function App(){
  const [products,setProducts]=useState(()=>load("smile_products",starterProducts));
  const [cart,setCart]=useState(()=>load("smile_cart",[]));
  const [wishlist,setWishlist]=useState(()=>load("smile_wishlist",[]));
  const [orders,setOrders]=useState(()=>load("smile_orders",[]));
  const [view,setView]=useState("home");
  const [category,setCategory]=useState("All");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const [admin,setAdmin]=useState(false);
  const [editing,setEditing]=useState(null);
  const [mobileMenu,setMobileMenu]=useState(false);

  useEffect(()=>localStorage.setItem("smile_products",JSON.stringify(products)),[products]);
  useEffect(()=>localStorage.setItem("smile_cart",JSON.stringify(cart)),[cart]);
  useEffect(()=>localStorage.setItem("smile_wishlist",JSON.stringify(wishlist)),[wishlist]);
  useEffect(()=>localStorage.setItem("smile_orders",JSON.stringify(orders)),[orders]);

  const filtered=useMemo(()=>products.filter(p=>(category==="All"||p.category===category) && p.name.toLowerCase().includes(query.toLowerCase())),[products,category,query]);
  const cartCount=cart.reduce((n,x)=>n+x.qty,0);

  function addCart(p){
    setCart(c=>c.some(x=>x.id===p.id)?c.map(x=>x.id===p.id?{...x,qty:Math.min(x.qty+1,p.stock)}:x):[...c,{id:p.id,qty:1}]);
  }
  function toggleWish(id){ setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]); }
  function placeOrder(){
    if(!cart.length) return;
    const items=cart.map(x=>{const p=products.find(p=>p.id===x.id); return {productId:p.id,name:p.name,qty:x.qty,price:p.price}});
    const total=items.reduce((s,x)=>s+x.price*x.qty,0);
    const order={id:"SHA-"+Date.now().toString().slice(-6),items,total,status:"Pending",date:new Date().toLocaleString()};
    setOrders(o=>[order,...o]);
    setProducts(ps=>ps.map(p=>{const i=cart.find(x=>x.id===p.id);return i?{...p,stock:Math.max(0,p.stock-i.qty)}:p}));
    setCart([]); setView("orders"); alert("Order placed successfully!");
  }

  if(admin) return <Admin products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} onExit={()=>setAdmin(false)} editing={editing} setEditing={setEditing}/>;

  return <>
    <header className="header">
      <button className="icon mobileOnly" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X/>:<Menu/>}</button>
      <div className="logo" onClick={()=>setView("home")}>SHA <span>SHOP</span></div>
      <nav className={mobileMenu?"nav open":"nav"}>
        {["home","products","orders"].map(v=><button key={v} onClick={()=>{setView(v);setMobileMenu(false)}}>{v==="home"?"Home":v==="products"?"Shop":"My Orders"}</button>)}
        <button onClick={()=>{setAdmin(true);setMobileMenu(false)}}>Admin</button>
      </nav>
      <div className="headActions">
        <div className="search"><Search size={18}/><input placeholder="Search products..." value={query} onChange={e=>{setQuery(e.target.value);setView("products")}}/></div>
        <button className="icon" onClick={()=>setView("wishlist")}><Heart/><sup>{wishlist.length}</sup></button>
        <button className="icon" onClick={()=>setView("cart")}><ShoppingBag/><sup>{cartCount}</sup></button>
      </div>
    </header>

    {view==="home" && <Home setView={setView} setCategory={setCategory} products={products} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist}/>}
    {view==="products" && <Shop products={filtered} category={category} setCategory={setCategory} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} open={setSelected}/>}
    {view==="wishlist" && <Shop products={products.filter(p=>wishlist.includes(p.id))} category="Wishlist" setCategory={()=>{}} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} open={setSelected}/>}
    {view==="cart" && <Cart cart={cart} products={products} setCart={setCart} placeOrder={placeOrder}/>}
    {view==="orders" && <Orders orders={orders}/>}
    {selected && <ProductModal p={selected} close={()=>setSelected(null)} addCart={addCart} wish={()=>toggleWish(selected.id)} wished={wishlist.includes(selected.id)}/>}
  </>
}

function Home({setView,setCategory,products,addCart,toggleWish,wishlist}){
 return <main>
  <section className="hero"><div><p className="eyebrow">WELCOME TO SMILE COLLECTION</p><h1>Style that feels<br/><em>uniquely yours.</em></h1><p>Jewellery, burqa, hijab and fashion essentials curated for your everyday elegance.</p><button className="goldBtn" onClick={()=>setView("products")}>Shop Now <ChevronRight size={18}/></button></div><div className="heroCard"><span>NEW COLLECTION</span><strong>Elegant<br/>Essentials</strong></div></section>
  <section className="section"><div className="sectionTitle"><div><p className="eyebrow">EXPLORE</p><h2>Shop by category</h2></div></div><div className="catGrid">{cats.slice(1).map(c=><button key={c} onClick={()=>{setCategory(c);setView("products")}}>{c}<ChevronRight size={16}/></button>)}</div></section>
  <ProductStrip title="New Arrivals" products={products.filter(p=>p.newArrival)} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist}/>
  <ProductStrip title="Best Sellers" products={products.filter(p=>p.bestSeller)} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist}/>
 </main>
}

function ProductStrip({title,products,addCart,toggleWish,wishlist}){
 return <section className="section"><div className="sectionTitle"><h2>{title}</h2><span>{products.length} products</span></div><div className="productGrid">{products.map(p=><ProductCard key={p.id} p={p} addCart={addCart} toggleWish={toggleWish} wished={wishlist.includes(p.id)}/>)}</div></section>
}

function Shop({products,category,setCategory,addCart,toggleWish,wishlist,open}){
 return <main className="section"><div className="sectionTitle"><div><p className="eyebrow">SMILE COLLECTION</p><h2>{category==="All"?"All Products":category}</h2></div><span>{products.length} products</span></div><div className="chips">{cats.map(c=><button className={category===c?"active":""} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="productGrid">{products.map(p=><ProductCard key={p.id} p={p} addCart={addCart} toggleWish={toggleWish} wished={wishlist.includes(p.id)} open={open}/>)}</div>{!products.length&&<div className="empty">No products found.</div>}</main>
}

function ProductCard({p,addCart,toggleWish,wished,open}){
 return <article className="card"><div className="picWrap" onClick={()=>open?.(p)}><img src={p.image} alt={p.name}/>{p.oldPrice>p.price&&<b className="discount">{Math.round((1-p.price/p.oldPrice)*100)}% OFF</b>}<button className={wished?"wish active":"wish"} onClick={e=>{e.stopPropagation();toggleWish(p.id)}}><Heart size={18} fill={wished?"currentColor":"none"}/></button></div><div className="cardBody"><small>{p.category}</small><h3 onClick={()=>open?.(p)}>{p.name}</h3><div className="price">₹{p.price.toLocaleString()} <del>₹{p.oldPrice.toLocaleString()}</del></div><button className="addBtn" disabled={!p.stock} onClick={()=>addCart(p)}>{p.stock?"Add to Cart":"Out of Stock"}</button></div></article>
}

function ProductModal({p,close,addCart,wish,wished}){
 return <div className="modalBack" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button><img src={p.image} alt={p.name}/><div className="modalInfo"><small>{p.category}</small><h2>{p.name}</h2><p>{p.description}</p><div className="price big">₹{p.price.toLocaleString()} <del>₹{p.oldPrice.toLocaleString()}</del></div><p><b>Stock:</b> {p.stock}</p><div className="modalActions"><button className="goldBtn" disabled={!p.stock} onClick={()=>{addCart(p);close()}}>Add to Cart</button><button className="outlineBtn" onClick={wish}>{wished?"♥ Wishlisted":"♡ Wishlist"}</button></div></div></div></div>
}

function Cart({cart,products,setCart,placeOrder}){
 const rows=cart.map(x=>({...x,p:products.find(p=>p.id===x.id)})).filter(x=>x.p); const total=rows.reduce((s,x)=>s+x.p.price*x.qty,0);
 return <main className="section"><div className="sectionTitle"><h2>Your Cart</h2><span>{cart.reduce((s,x)=>s+x.qty,0)} items</span></div>{!rows.length?<div className="empty">Your cart is empty.</div>:<div className="cartLayout"><div>{rows.map(x=><div className="cartRow" key={x.id}><img src={x.p.image}/><div><h3>{x.p.name}</h3><small>{x.p.category}</small><div className="price">₹{x.p.price.toLocaleString()}</div></div><div className="qty"><button onClick={()=>setCart(c=>c.map(i=>i.id===x.id?{...i,qty:Math.max(1,i.qty-1)}:i))}>−</button><b>{x.qty}</b><button onClick={()=>setCart(c=>c.map(i=>i.id===x.id?{...i,qty:Math.min(x.p.stock,i.qty+1)}:i))}>+</button></div><button className="delete" onClick={()=>setCart(c=>c.filter(i=>i.id!==x.id))}><Trash2 size={18}/></button></div>)}</div><aside className="summary"><h3>Order Summary</h3><div><span>Subtotal</span><b>₹{total.toLocaleString()}</b></div><div><span>Delivery</span><b>Free</b></div><hr/><div className="total"><span>Total</span><b>₹{total.toLocaleString()}</b></div><button className="goldBtn full" onClick={placeOrder}>Place Order</button></aside></div>}</main>
}

function Orders({orders}){return <main className="section"><div className="sectionTitle"><h2>My Orders</h2></div>{!orders.length?<div className="empty">No orders yet.</div>:<div className="orders">{orders.map(o=><div className="order" key={o.id}><div><b>{o.id}</b><small>{o.date}</small></div><div><b>₹{o.total.toLocaleString()}</b><span className="status">{o.status}</span></div></div>)}</div>}</main>}

function Admin({products,setProducts,orders,setOrders,onExit,editing,setEditing}){
 const blank={name:"",category:"Jewellery",price:"",oldPrice:"",stock:"",image:"",description:"",sizes:["Free Size"],colors:["Gold"],newArrival:false,bestSeller:false};
 const [form,setForm]=useState(editing||blank);
 useEffect(()=>setForm(editing||blank),[editing]);
 function save(e){e.preventDefault(); if(!form.name||!form.price)return alert("Product name and selling price are required."); const p={...form,id:editing?.id||Date.now(),price:Number(form.price),oldPrice:Number(form.oldPrice||form.price),stock:Number(form.stock||0),image:form.image||"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"}; setProducts(ps=>editing?ps.map(x=>x.id===p.id?p:x):[p,...ps]);setEditing(null);setForm(blank);}
 function del(id){if(confirm("Delete this product?"))setProducts(ps=>ps.filter(p=>p.id!==id))}
 function status(id,s){setOrders(os=>os.map(o=>o.id===id?{...o,status:s}:o))}
 return <div className="admin"><aside className="adminSide"><div className="logo">SHA <span>SHOP</span></div><h4>ADMIN PANEL</h4><button className="active"><LayoutDashboard size={17}/> Dashboard</button><button><Package size={17}/> Products</button><button onClick={onExit}><LogOut size={17}/> Storefront</button></aside><main className="adminMain"><div className="adminTop"><div><p className="eyebrow">CONTROL CENTER</p><h1>Admin Dashboard</h1></div></div><div className="stats"><div><span>Products</span><b>{products.length}</b></div><div><span>Orders</span><b>{orders.length}</b></div><div><span>Low Stock</span><b>{products.filter(p=>p.stock>0&&p.stock<=5).length}</b></div><div><span>Sales</span><b>₹{orders.reduce((s,o)=>s+o.total,0).toLocaleString()}</b></div></div><section className="adminSection"><div className="adminHeader"><h2>{editing?"Edit Product":"Products"}</h2>{!editing&&<button className="goldBtn" onClick={()=>setEditing({...blank})}><Plus size={17}/> Add Product</button>}</div>{editing?<form className="form" onSubmit={save}><label>Product Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{cats.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><div className="two"><label>Selling Price<input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Original Price<input type="number" value={form.oldPrice} onChange={e=>setForm({...form,oldPrice:e.target.value})}/></label></div><div className="two"><label>Stock<input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></label><label>Image URL<input value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></label></div><label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="check"><label><input type="checkbox" checked={form.newArrival} onChange={e=>setForm({...form,newArrival:e.target.checked})}/> New Arrival</label><label><input type="checkbox" checked={form.bestSeller} onChange={e=>setForm({...form,bestSeller:e.target.checked})}/> Best Seller</label></div><div className="formActions"><button type="button" className="outlineBtn" onClick={()=>setEditing(null)}>Cancel</button><button className="goldBtn">{editing?.id?"Save Changes":"Add Product"}</button></div></form>:<div className="adminProducts">{products.map(p=><div className="adminProduct" key={p.id}><img src={p.image}/><div><b>{p.name}</b><small>{p.category} · Stock {p.stock}</small><span>₹{p.price.toLocaleString()}</span></div><button className="icon" onClick={()=>setEditing(p)}><Pencil size={17}/></button><button className="icon danger" onClick={()=>del(p.id)}><Trash2 size={17}/></button></div>)}</div>}</section><section className="adminSection"><div className="adminHeader"><h2>Orders</h2></div>{orders.length?<div className="orders">{orders.map(o=><div className="order" key={o.id}><div><b>{o.id}</b><small>{o.date}</small></div><div><b>₹{o.total.toLocaleString()}</b><select value={o.status} onChange={e=>status(o.id,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></div></div>)}</div>:<div className="empty small">No orders yet.</div>}</section></main></div>
}

createRoot(document.getElementById("root")).render(<App/>);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/SMILE_COLLECTION/sw.js").catch(() => {});
  });
}
