import {useState, useEffect} from 'react'
import EditModal from '../../../components/EditModal'
import styled from 'styled-components'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxios';

const addProductapi = () => {

}
const editProductapi = () => {
    
}



const Container = styled.div`
  margin: 1rem 0;
  display: grid;
  gap: 1rem;
  @media (max-width: 800px) { //added this bza left side was overflowing
    margin-left: 1em;
  }
`
const Section = styled.div`
  display: flex;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`
const Left = styled.div`
  flex: 1;

`
const Right = styled.div`
  flex: 2;
`
const UploadImage = styled.div`
  
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed black;
  padding: 1rem;
label
  > svg {
    color: teal;
  }
`
const ImagePreview = styled.img`
  width: 6rem;
  margin: 0.5rem 0;
`
const UploadTitle = styled.span`

`
const UploadDesc = styled.p`
  font-size: 0.7rem;
`

const Textarea = styled.textarea`
    box-sizing: border-box;
    width: 100%;
    height: 500px;
    resize: vertical;
    padding: 0.9rem 0.5rem;
    background-color: #F4F5F7;
    border: 1px rgb(229,231,235) solid;
    border-radius: 1vmin;
    font-size: 1.1rem;
    outline-color: lightblue;
`
const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.9rem 0.5rem;
  background-color: #F4F5F7;
  border: 1px rgb(229,231,235) solid;
  border-radius: 1vmin;
  font-size: 1.1rem;
  outline: none;

  :focus  {
    background-color: white;
  }
`

const TagSection = styled.div`
  display: flex;
  background-color: #F4F5F7;
  flex-wrap: wrap;

  > input {
    border-radius: 0;
    border: none;
    
  }
`

const Tag = styled.div`
  margin: 0.8rem 0.4rem;
  background-color: #E1E1E1;
  background-color: ${p => p.color ? p.color : "#E1E1E1"};
  
  display: flex;
  width: max-content;

  >:first-child {
    color: ${p => p.color ? "white" : "black"};
    margin: auto;
    padding: 0 0.5rem;
    font-size: 0.8rem;
    
    
  }

  >:last-child {
    font-size: 0.8rem;
    background-color: #D4D4D4;
  }

`

function EditProducts({isOpen, setIsOpen, EditProductInfo, title, desc}) {
  const DefaultValues = {title: "", productno: "", size: "", color: "", desc: "",categories: [], quantity: "", price: "", img: null}
  
  const dispatch = useDispatch();
  const [Product, setProduct] = useState(DefaultValues)

  const { userRequest } = useAxios()

 
  useEffect(() => {
    if(!EditProductInfo) return 
    setProduct({...EditProductInfo})
  }, [EditProductInfo])

  const handleChange = (e, type) => {
    const { name, value} = e.target;
    const property = type || name
    console.log("input changed on " + title)

    if(name ==="img"){
      const file = e.target.files[0];
      const filereader = new FileReader();
      filereader.readAsDataURL(file);
      filereader.onload = () => {  
        console.log("image changed on " + title)
        setProduct(p => ({...p, img: filereader.result}))
      }
      return
    }
    
    const prev = Product[property]; //we ddnt used Product.property bcz iw will find a field where the key is property but in this cal it will find the value of property
    if(Array.isArray(prev)) {
      const exist = prev.filter(i => i === value.toUpperCase())
      if(exist?.length) return //TODO: add Errors
      
    }
    setProduct((p) => ({...p, [property] : Array.isArray(prev) ? [...prev, value.toUpperCase()] : value})) //if it's array then append or setValue

    e.target.value = "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!Product.img) return dispatch(toast.error("Product Image can't be empty, Please add a Image!"));
    if(!Product.size.length) return dispatch(toast.error("Product Size can't be empty, Please add at least 1 size"));
    if(!Product.color.length) return dispatch(toast.error("Product Color can't be empty, Please add at least 1 color"))
    if(!Product.categories.length) return dispatch(toast.error("Product Categories can't be empty, Please add at least 1 categories"))

    if(!EditProductInfo) {
        try {
            const res = await userRequest.post(`/product`, Product);
            setIsOpen(false)
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const res = await userRequest.put(`/product/${Product._id}`, Product);
            dispatch(setError("product updated successfully"))
            setIsOpen(false)
        } catch (error) {
            console.log(error)
        }
    } 
  }

  const handleDelete = (property, value) => {
    setProduct(p => ({...p, [property]: p[property].filter(i => i!==value)}))
  }

  useEffect(() => {
    console.log(Product)
  },[Product])


  const ifForImf = Math.random() * 1000 //this is used Because Img id was chasing bcz this component was rendered 2 time 1 for add and another for update
  return (
    <EditModal isOpen={isOpen} setIsOpen={setIsOpen} action={handleSubmit} title={title} desc={desc}>
              <Container>
          <Section>
            <Left>
              <label>Product Image</label>
            </Left>
            <Right>
            
            <input accept="image/jpeg, image/png" name='img' type="file" style={{display: "none"}} id={ifForImf} onChange={e => handleChange(e)}/>
              <label htmlFor={ifForImf}>
                <UploadImage>
                  <CloudUploadOutlinedIcon/>
                  <UploadTitle>Drag your image here</UploadTitle>
                  <UploadDesc>(Only *.jpeg and *.png images will be accepted)</UploadDesc>
                </UploadImage>
              </label>
              <ImagePreview src={Product.img}/>
            </Right>
          </Section>

           <Section>
            <Left><label>Product Name/Title</label></Left>
            <Right><Input name="title" value={Product.title} onChange={e => handleChange(e)} required/></Right>
          </Section>

          <Section>
            <Left><label>Product Number</label></Left>
            <Right><Input name="productno" value={Product.productno} onChange={e => handleChange(e)} required/></Right>
          </Section>

          <Section>
            <Left><label>Product Size</label></Left>
            <Right> <Input name="size" value={Product.size} onChange={e => handleChange(e)} required/> </Right>
          </Section>

          <Section>
            <Left><label>Product Color</label></Left>
            <Right> <Input style={{height: "70px"}} type='color' name="color" value={Product.color} onChange={e => handleChange(e)} required/> </Right>
          </Section>

          <Section>
            <Left><label>Product Description</label></Left>
            <Right><Textarea name="desc" value={Product.desc || ""} onChange={e => handleChange(e)} required/></Right>
          </Section>

          <Section>
            <Left><label>Product Category</label></Left>
            <Right>
              <TagSection>
                {Product?.categories?.map((s) => {
                  return <Tag key={s}>
                  <span>{s}</span><div onClick={() => handleDelete("categories",s)}><CloseOutlinedIcon/></div>
                </Tag>
                })}
                <Input placeholder='Categories (Write and press Enter)' name="categories" onKeyDown={e => {if(e.key==="Enter") handleChange(e, "categories")}}/>
              </TagSection>
            </Right>
          </Section>

          <Section>
            <Left><label>Product Quantity</label></Left>
            <Right><Input type="number" name="quantity" value={Product.quantity} onChange={e => handleChange(e)} required/></Right>
          </Section>

          <Section>
            <Left><label>Product Price</label></Left>
            <Right><Input type="number" name="price" value={Product.price} onChange={e => handleChange(e)} required/></Right>
          </Section>
          
        </Container>
    </EditModal>
  )
}

export default EditProducts