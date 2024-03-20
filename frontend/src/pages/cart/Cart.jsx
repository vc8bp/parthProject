import React, { useEffect, useState}from 'react'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveIcon from '@mui/icons-material/Remove';
import  { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteProduct } from '../../redux/slice/cartSlice'
import EmptyCartComponent from './EmptyCartComp'
import Loading from '../../components/Loading'
import useAxios from '../../hooks/useAxios';
import toast from 'react-hot-toast';
import Checkout from './Checkout';




const Container = styled.div``
const Wrapper = styled.div`
    padding: 20px;
`
const Title = styled.div`
    font-weight: 300;
    text-align: center;
`
const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
`
const TopButton = styled.button`
    padding: 10px;
    font-weight: 600;
    cursor: pointer;
    border: ${props=> props.type ==="filled" && "none"};
    background-color: ${props=> props.type ==="filled" ? "Black" : "transparent"};
    color: ${props=> props.type ==="filled" && "white"};
    
`
const TopTexts = styled.div`

    @media only screen and (max-width: 700px) {
        display: "none";
    }
`
const TopText = styled.span`
    text-decoration: underline;
    cursor: pointer;
    margin: 10px;
`

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    //flex-direction: column;
    @media only screen and (max-width: 970px) {
        flex-direction: column;
        align-items: center;       
    }
`
const Info = styled.div`
    flex: 3;
    width: 100%;
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 970px) {
        align-items: center;       
    }

`



const Product = styled.div`
    flex: 2;
    display: flex;
    margin: 10px 0px;
    position: relative;
    overflow: hidden;
    background-color: #f7f7f7;
    margin-right: 20px;
    transition: all 0.3s ease-in-out;

    @media only screen and (max-width: 700px) {
        flex-direction: "column";
        margin: "10px 5px";
    } 
    @media only screen and (max-width: 970px) {
        width: 99%;
    }

    &:hover{
      box-shadow: 0px 0px 5px #888888;
      transform: scale(1.02);
    }
`
const DelButton = styled.div`
    
    position: absolute;
    right: 0px;
    top: 0px;

    @media only screen and (max-width: 700px) {
        top: "45%";
    }
    
`

const ProductDeteail = styled.div`
    flex: 2;
    width: 100%;
    display: flex;
    @media only screen and (max-width: 700px) {
        flex: "1";
        width: "100vw";
    }
`
const Image = styled.img`
    width: 200px;
    max-width: 30%;
    object-fit: cover;

`
const Details = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: fit-content;
    padding-right: 10px;
    justify-content: space-around;
    margin: 10px;
    @media only screen and (max-width: 700px) {
        width: "100%";
    }
    `
const ProductName = styled.span`
`
const ProductNumber = styled.span``
const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props => props.color};
`
const ProductSize = styled.span``
const PriceDeteail =styled.div`    
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 700px) {
        margin-top: "1rem";
        
    }
    
`


const ProductAmmountContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    
    
`
const ValueARButton = styled.div`
    cursor: pointer;
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:active {
        transform:scale(1.1);
     }
`

const ProductAmmount = styled.div`
    height: 30px;
    width: 30px; 
    border: solid 1px teal;
    padding :5px ;
    border-radius: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    
`
const ProductPrice = styled.span`
    margin: 20px 0px;
    font-weight: 600;
    font-size: 1.2rem;
    &:hover {
        transform: scale(1.1);
    }
`

const Hr = styled.hr`
    background-color: #eee;
    height: 1px;
    border: none;
`


const Summary = styled.div`
    flex: 1;
    max-height: 50vh;
    width: 350px;
    max-width: 100%;
    border: solid lightgray 1px;
    border-radius: 2vmax;
    padding: 10px;
    @media only screen and (max-width: 970px) {
        width: 90%;
    }
`

const SummaryTitle = styled.h1`
    font-weight: 300;
    margin: 10px 0px;
`
const SummaryItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 5px 0px;
    font-weight: ${props=> props.type === "total" && 600};
    font-size: ${props=> props.type === "total" && 1.2}rem;
    margin: ${props=> props.type === "total" && 10}px 0px;
`
const SummaryText = styled.div`
    white-space: nowrap;
    width: 80%; 
    overflow: hidden;
`
const SummaryPrice = styled.div`
    
`
const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const Button = styled.button`
    background-color: black;
    cursor: pointer;   
    color: white;
    border: none;
    padding: 20px;
    width: 80%;
    margin-top: 20px;

    :disabled {
        background-color: #6b6d70;
        cursor: not-allowed;
    }

    @media only screen and (max-width: 700px) {
        width: "50%";
        border-radius: "5%" ;
    }
    
    
`

function CartPage(props) {
    const { userRequest } = useAxios()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [cartProductRes, setCartProductRes] = useState();
    const [fetchCartLoading, setFetchCartLoading] = useState();

    //to change title as soon as component mounts
    useEffect(() => {
        document.title = `SatnamCreation - ${props.title}`
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    const user = useSelector(state => state?.user.info);



    //get User Cart
    useEffect(() => {
        (async () => {
            try{      
                setFetchCartLoading(true)         
                const res = await userRequest.get(`/cart`)
                setFetchCartLoading(false)
                setCartProductRes(res.data)
                
            }catch(err){
                console.log("error", err)
                setFetchCartLoading(false)
                toast.error(err.response.data.message)      //setting error      
            }           
            return () => {
                setCartProductRes(null)
            }
        })()
    }, [])

    //count cart total
    const [totalCartPrice, setTotalCartPrice] = useState(0)
    useEffect(() => {   
        const total = cartProductRes?.products.reduce((total, item) => {
            return total + (item.price * item.quantity)
        },0)
        setTotalCartPrice(total);
    }, [cartProductRes?.products, cartProductRes?.products?.map(p => p.quantity)])//map is used bcz we need to reRender this component if any products quantity changes so we maped true every product quantity
     
    //delete product
    const handleDeleteProduct = async (id) => {
        try{
            const filteredProducts = cartProductRes?.products?.filter(p => {
                return id !== p.productID
            })
            setCartProductRes(e => ({...e, products: filteredProducts}))
            dispatch(deleteProduct())
            const res = await userRequest.delete(`/api/cart/${id}`)     
            toast.success(res.data.message)
        }catch(error){
            console.log("error", error)
            toast.error(error.response.data.message)
        }
    }

    //handle dec inc in product Quantity
    const handleProductQuantityChange = async (productID, quantity) => {

        if(quantity === 0 ) return handleDeleteProduct(productID)
        try {
            const res = await userRequest.put(`/cart/updatequantity/${productID}/${quantity}`)
            const productIndex = cartProductRes.products.findIndex(p => p.productID === productID)
            console.log({productIndex})
            const newProduct = cartProductRes.products[productIndex].quantity = quantity
            setCartProductRes(p => ({...p, newProduct}))
            toast.success(res.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const [isCheckoutOpen, setIsCheckoutOpen] = useState()


    const [isCheckoutLoading, setischeckoutLoading] = useState(false);
    const userAddress = useSelector(state => state.user.address)   
    const handleCheckout = async () => {
        try {
            setischeckoutLoading(true) 

            const {data:{order}} = await userRequest.post("/buy/checkout",{
                user: user._id,
                type: "cart",
                userInfo: {
                    address: userAddress,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                }
            });
        } catch (error) {
            console.log({error})
        }
        setischeckoutLoading(false) 
    }

    const onSubmit = (agnetId) => {
        console.log(agnetId)
        (async () => {
            try {
                const {data} = await userRequest.post("/checkout", {agent})
            } catch (error) {
                console.log("Error")
            }
        })()
    }

  return (
    <Container>
        <Wrapper>
            <Title>Cart</Title>
            {fetchCartLoading ? <Loading/> :
            (cartProductRes?.products.length
            ? <>
            <Top>
                <TopButton onClick={() => navigate(-1)}>Continue Shopping</TopButton>
                <TopTexts>
                    <TopText>Shopping ba</TopText>
                    <TopText>Your Wishlist</TopText>
                </TopTexts>
                <TopButton type="filled" onClick={handleCheckout} disabled={isCheckoutLoading? true : false}>CheckOut Now</TopButton>
            </Top>
            <Bottom>
                <Info>    
                    {cartProductRes?.products?.map((product) => (
                        <Product key={product.productID}>
                            <DelButton onClick={() => handleDeleteProduct(product.productID)}>
                                <ClearIcon style={{fontSize: "40px" , color: "#AB2A28"}}/>
                            </DelButton>
                            <ProductDeteail onClick={() => navigate(`/product/${product._id}`)}>
                                <Image src={product.img}/>
                                <Details>
                                    <ProductName><b>Product:</b> {product.title}</ProductName>
                                    <ProductNumber><b>ID:</b> {product.productID}</ProductNumber>
                                    <ProductColor color={product.color}/>
                                    <ProductSize><b>Size:</b>  {product.size}</ProductSize>
                                </Details>
                            </ProductDeteail>
                            <PriceDeteail>
                                <ProductAmmountContainer>
                                    <ValueARButton onClick={() => handleProductQuantityChange(product.productID, --product.quantity)}>
                                        <RemoveIcon/>
                                    </ValueARButton>
                                    <ProductAmmount>{product.quantity}</ProductAmmount>
                                    <ValueARButton onClick={() => handleProductQuantityChange(product.productID, ++product.quantity)}>
                                        <AddIcon/>
                                    </ValueARButton>
                                </ProductAmmountContainer>
                                <ProductPrice>{product.price}</ProductPrice>
                            </PriceDeteail>
                        </Product>
                    ))}
                    <Hr/>
                </Info>
                <Summary>
                    <SummaryTitle>Products</SummaryTitle>
                        {cartProductRes?.products?.map((product) => (
                            <SummaryItem key={product._id}>
                                <SummaryText>{product.title}</SummaryText>
                                <SummaryPrice>{(product.price * product.quantity)?.toFixed(2)}</SummaryPrice>
                            </SummaryItem>
                        ))}
                        <SummaryItem type="total">
                            <SummaryText >Total</SummaryText>
                            <SummaryPrice>{totalCartPrice?.toFixed(2)}</SummaryPrice>
                        </SummaryItem>
                        <ButtonWrapper>
                            <Button onClick={() => setIsCheckoutOpen(true)} >Check out</Button>
                        </ButtonWrapper>    
                </Summary>
            
            </Bottom>
            </>
            : <EmptyCartComponent/>)}
        </Wrapper>
        <Checkout isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} submit={onSubmit} />

    </Container>
  )
}

export default CartPage