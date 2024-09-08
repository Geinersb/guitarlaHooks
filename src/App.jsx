import { useState, useEffect } from "react";
import Guitar from "./components/Guitar";
import Header from "./components/Header";
import { db } from "./data/db";

function App() {
  //aqui declaro los State
  // STATE, serecomiendan aqui arriba los hooks
  //con esto  valida si hay algo en el local storage para mantenerlo y si no deja el estate en vacio
const initialCart = ()=>{
  const localStorageCart = localStorage.getItem('cart')
  return localStorageCart ? JSON.parse(localStorageCart) : []
}

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const Max_Items = 5;
  const Min_Items = 1;

  //con esto se ingresa al carrito en el local Storage, con el useefect cada vez que encuentra un cambio lo guarda en el localstorage
  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart) )
  },[cart])

  //funcion para agregar a carrito
  function addToCart(item) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists >= 0) {
      //existe en el carrito
      if(cart[itemExists].quantity >= Max_Items) return
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart([...cart, item]);
    }

  
  }

  //funcion para Incrementar cantidades en carrito
  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < Max_Items) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  //funcion para decrementar cantidades en carrito
  function decreaseQuantity(id) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > Min_Items) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  //funcion para eliminar de carrito
  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  //funcion para Vaciar el carrito 
  function clearCart(){
    setCart([])
  }




  return (
    //con esto paso las funciones a otros componentes
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart = {clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
