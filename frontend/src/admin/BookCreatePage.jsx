import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../components/common/Message';
import Loader from '../components/common/Loader';
import FormContainer from '../components/common/FormContainer';
import { useCreateBookMutation, useUploadProductImageMutation, useUploadBookFileMutation } from '../redux/slices/booksApiSlice';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';

const BookCreatePage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('');
  const [pages, setPages] = useState(0);
  const [publishedDate, setPublishedDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const [createBook, { isLoading, error }] = useCreateBookMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const [uploadBookFile, { isLoading: loadingFileUpload }] = useUploadBookFileMutation();
  const { data: categories } = useGetCategoriesQuery();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createBook({
        name,
        price,
        image,
        brand: publisher, // Mapping publisher to brand for compatibility if needed, or just use brand field
        category,
        description,
        countInStock,
        isbn,
        publisher,
        language,
        pages,
        publishedDate,
        fileUrl,
      }).unwrap();
      navigate('/admin/books');
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadPdfHandler = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      const res = await uploadBookFile(formData).unwrap();
      setFileUrl(res.fileUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Row>
        <Col>
            <h1>Create Book</h1>
        </Col>
        <Col className='text-end'>
             <Button className='my-3' onClick={() => navigate('/admin/books')}>
                Go Back
            </Button>
        </Col>
      </Row>
      
      <FormContainer>
        {isLoading && <Loader />}
        {error && <Message variant='danger'>{error?.data?.message || error.error}</Message>}
        <Form onSubmit={submitHandler}>
          <fieldset className="admin-form-section">
            <legend>Book Details</legend>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='isbn' className='my-2'>
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter ISBN'
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='price' className='my-2'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='publisher' className='my-2'>
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter publisher'
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='category' className='my-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>Select Category</option>
                {Array.isArray(categories?.categories) && categories.categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='description' className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='language' className='my-2'>
              <Form.Label>Language</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter language'
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='pages' className='my-2'>
              <Form.Label>Pages</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter pages'
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='publishedDate' className='my-2'>
              <Form.Label>Published Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='Enter published date'
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Files</legend>
            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                label='Choose File'
                onChange={uploadFileHandler}
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>
            <Form.Group controlId='fileUrl' className='my-2'>
              <Form.Label>Book PDF File (Max 50MB)</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter file url'
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                label='Choose PDF'
                onChange={uploadPdfHandler}
              ></Form.Control>
              {loadingFileUpload && <Loader />}
            </Form.Group>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Inventory</legend>
            <Form.Group controlId='countInStock' className='my-2'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </fieldset>
          <Button type='submit' variant='primary' className='my-2'>
            Create
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default BookCreatePage;
