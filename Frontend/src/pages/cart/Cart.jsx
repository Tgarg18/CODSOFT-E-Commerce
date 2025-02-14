import { useDispatch, useSelector } from "react-redux";
import { addQuantity, reduceQuantity, removeItem, userCart } from "./CartSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { MdError } from "react-icons/md";
import "./cart.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function Cart() {
  const Navigate=useNavigate();
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();
  const change = useSelector((state) => state.cart.cart);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const [address, setAddress] = useState("");
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getAllCartItems`,{withCredentials:true});
        dispatch(userCart(response.data.data));
        // console.log('this is csrt : ',{response})
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  async function removeItemHandler(item) {
    // console.log(item)
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/deleteItem`, {
        data: { data:{itemId: item._id} },
        withCredentials: true
      });
      if (response.data.success === true) {
        dispatch(removeItem(item));
      }
    } catch (err) {
      console.log("Error : ", err);
    }
  }

  async function reduceQuantityHandler(item) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/reduceQuantity`, {
        data:{itemId: item._id},
      },{withCredentials:true});

      if (response.data.success === true) {
        dispatch(reduceQuantity(item));
      }
    } catch (err) {
      console.log("ERROR : ", err);
    }
  }

  async function addQuantityHandler(item) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/addQuantity`, {
        data:{itemId: item._id},
      },{withCredentials:true});
      if (response.data.success === true) {
        console.log("Hello");
        dispatch(addQuantity(item));
      }
    } catch (err) {
      console.log(err);
    }
  }
  // console.log({cartItems})
  const cart = useSelector((state) => state.cart.cart);
  useEffect(() => {
    let p = 0;
    change.forEach((item) => {
      if (item.product.inStock)
        p +=
          (item.product.Gem.totalPrice +
            item.product.metal.weightInGram * item.product.metal.pricePerGram) *
          item.quantity;
    });
    setPrice(p);
  }, [change]);
  useEffect(() => {
    setCartItems(change);
    console.log(change);
  }, [change]);

  return (
    <div className=" flex flex-col items-center py-8 min-h-[49vh] relative">
      {display ? (
        <div className="absolute top-[30%] mx-auto z-10 gap-2 flex flex-col justify-center items-center p-10 rounded-lg shadow-md shadow-black bg-[#2622229a] ">
          <div className="text-2xl text-white">Add Order Address</div>
          <textarea
            value={address}
            onChange={(e) => {
              setAddress((a) => e.target.value);
            }}
            rows={2}
            cols={30}
            className="inp"
          />
          <input
            type="submit"
            className="inp w-[100px]"
          />
        </div>
      ) : (
        <></>
      )}

      <div className=" lg:h-[15vh] md:h-[9vh]  w-[100vw] h-[10vh] text-2xl flex justify-center items-center">
        Your cart items
      </div>
      <div className="lg:h-[6vh] md:h-[6vh]  w-[100vw] h-[8vh]  flex justify-center items-center text-custom underline font-semibold text-sm">
        <Link to="/">Back to Home</Link>
      </div>
      {cartItems ? (
        cartItems.length ? (
          <div className="lg:w-[70vw] md:w-[80vw]  sm:w-[95vw] w-[99vw] border-t  mt-[5vh]">
            {cartItems.map((item) => (
              <div
                // key={item.product.hasOwnProperty("size") ? item.product.secId : item.product.id}
                key={item._id}
                className="flex justify-between border-b my-[5vh] py-[2vh] "
              >
                <div className="flex gap-x-[2vw] h-[90px] ">
                  <Link to={`/productInfo/${item.product && item.product._id}`}>
                    <div className="w-[90px] h-[90px] overflow-hidden flex flex-col justify-center items-center rounded-[15%] bg-black">
                      <img
                        src={item.product && item.product.images[0]}
                        className="w-[100%] h-[100%] shrink-0 object-cover object-center  "
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col sm:w-auto w-[40vw]  h-[90px] justify-center gap-[3vh]">
                    <Link
                      to={`/productInfo/${item.product && item.product._id}`}
                    >
                      <div className="font-semibold lg:text-lg sm:text-lg text-sm">
                        {item.product && item.product.name}{" "}
                        {item.product && item.size
                          ? `(Size : ${item.size})`
                          : null}
                      </div>
                    </Link>
                    <div className=" sm:text-sm text-xs text-custom font-semibold ">
                      <button
                        // onClick={() => dispatch(removeItem(item))}
                        onClick={(e) => removeItemHandler(item)}
                        className="hover:underline"
                      >
                        <MdDelete size={25} />
                      </button>
                      {item.product && !item.product.inStock && (
                        <div className=" text-red-600 flex  items-center ">
                          <MdError />
                          &nbsp; Out of stock
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col font-medium lg:text-base md:text-base sm:text-base text-xs gap-y-[1vh]">
                  <div className="flex">
                    <div className="w-[10vw] head">Price: </div>{" "}
                    <div>
                      {" "}
                      {item.product &&
                        item.product.Gem.totalPrice +
                          item.product.metal.pricePerGram *
                            item.product.metal.weightInGram}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-[10vw] head">Quantity:</div>
                    <div className="w-[55px] justify-between flex px-1 text-base h-[25px] items-center customIncrement ">
                      <button
                        // onClick={() => dispatch(reduceQuantity(item.product))}
                        onClick={(e) => reduceQuantityHandler(item)}
                        className="flex justify-center items-center sm:text-xl text-lg"
                      >
                        -
                      </button>
                      <div className="flex justify-center items-center">
                        {item.product && item.quantity}
                      </div>
                      <button
                        // onClick={() => dispatch(addQuantity(item.product))}
                        onClick={(e) => addQuantityHandler(item)}
                        className="flex justify-center items-center sm:text-xl text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-[10vw] head">Total: </div>
                    <div>
                      {(item.product.Gem.totalPrice +
                        item.product.metal.pricePerGram *
                          item.product.metal.weightInGram) *
                        item.quantity}
                    </div>
                  </div>

                  {item.product.hasOwnProperty("size") && (
                    <div className="flex">
                      <div className="w-[10vw] head">Size: </div>
                      <div className=" sm:w-[55px] w-[50px] sm:h-[30px] h-[20px] flex justify-center items-center sm:text-base text-xs">
                        {item.product.size}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end sm:text-lg text-base font-semibold">
              {/*  price component */}
              {cartItems.length !== 0 && (
                <div className="flex gap-[5vw] items-center">
                  <div>Sub-Total &nbsp; Rs-{price}</div>
                  <div className="inp btn flex justify-center text-sm sm:w-[150px] sm:h-[45px] hover:scale-105">
                    <button onClick={() => setDisplay(1)}>Check Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Your Cart is empty</div>
        )
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}
