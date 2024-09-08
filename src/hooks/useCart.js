import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
//para los custom hooks siempre se debe utilizar la palabra use y el nombre del hook

export const useCart = ()=> {

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
      
        
  //STATE DERIVADO
  const isEmpty = useMemo( () => cart.length === 0,[cart]);

  const cartTotal = useMemo(()=> cart.reduce((total, item) => total + (item.quantity * item.price), 0 ), [cart])

      
   

    return {
       data,
       cart,
       addToCart,
       removeFromCart,
       decreaseQuantity,
       increaseQuantity,
       clearCart,
       isEmpty,
       cartTotal
    }

}