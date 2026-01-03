import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useGetBookDetailsQuery, useUpdateBookMutation, useUploadProductImageMutation } from '../redux/slices/booksApiSlice';
import BookFileUpload from './BookFileUpload';
import BookPreviewUpload from './BookPreviewUpload';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import FormContainer from '../components/common/FormContainer';

const BookEditPage = () => {
  const { id: bookId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('');
  const [pages, setPages] = useState(0);
  const [publishedDate, setPublishedDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const { data: book, isLoading, error } = useGetBookDetailsQuery(bookId);
  const [updateBook, { isLoading: loadingUpdate }] = useUpdateBookMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (book) {
      setName(book.name);
      setPrice(book.price);
      setImage(book.image);
      setBrand(book.brand);
      setCategory(book.category);
      setCountInStock(book.countInStock);
      setDescription(book.description);
      setIsbn(book.isbn || '');
      setPublisher(book.publisher || '');
      setLanguage(book.language || '');
      setPages(book.pages || 0);
      setPublishedDate(book.publishedDate ? book.publishedDate.substring(0, 10) : '');
      setFileUrl(book.fileUrl || '');
      setPreviewUrl(book.previewUrl || '');
    }
  }, [book]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateBook({
        bookId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        isbn,
        publisher,
        language,
        pages,
        publishedDate,
        fileUrl,
        previewUrl,
      }).unwrap();
      toast.success('Book updated');
      navigate('/admin/books');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };


  return (
    <Container>
      <Link to='/admin/books' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Book</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <fieldset className="admin-form-section">
              <legend>Book Details</legend>
              <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
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
              <Form.Group controlId='brand' className='my-2'>
                <Form.Label>Brand/Author</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
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
                  type='text'
                  placeholder='Enter category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='description' className='my-2'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
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
                <Form.Label>Book File (PDF/DOC)</Form.Label>
                <BookFileUpload onUpload={setFileUrl} />
                {fileUrl && (
                  <div className="mt-2"><strong>Current File:</strong> {fileUrl}</div>
                )}
              </Form.Group>
              <Form.Group controlId='previewUrl' className='my-2'>
                <Form.Label>Book Preview (PDF/Image)</Form.Label>
                <BookPreviewUpload onUpload={setPreviewUrl} />
                {previewUrl && (
                  <div className="mt-2"><strong>Current Preview:</strong> {previewUrl}</div>
                )}
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
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default BookEditPage;
