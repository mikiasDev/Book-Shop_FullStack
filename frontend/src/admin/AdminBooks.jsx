import React, { useState, useRef } from 'react';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';
import styles from './AdminBooksGrid.module.css';
import { Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useGetBooksQuery, useDeleteBookMutation } from '../redux/slices/booksApiSlice';
import { useSelector } from 'react-redux';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-toastify';


const AdminBooks = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const debounceTimeout = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const createRoute = userInfo && (userInfo.role === 'manager' || userInfo.role === 'support')
    ? '/admin/staff/book/create'
    : '/admin/book/create';

  const { data, isLoading, error, refetch } = useGetBooksQuery({
    pageNumber,
    keyword: debouncedSearch,
    category: filterCategory,
    stock: filterStock,
    price: filterPrice
  });
  const books = data?.books || [];
  const page = data?.page || 1;
  const pages = data?.pages || 1;

  // Categories for filter
  const { data: catData } = useGetCategoriesQuery({ pageNumber: 1, pageSize: 100 });
  const categories = Array.isArray(catData?.categories) ? catData.categories : [];

  const [deleteBook, { isLoading: loadingDelete }] = useDeleteBookMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        toast.success('Book deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Debounce search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPageNumber(1);
    }, 400);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPageNumber(1);
  };

  return (
    <>
      <div className="admin-page-content">
        <h2 className="admin-page-title">Book Management</h2>
        <LinkContainer to={createRoute}>
          <Button className="mb-3" variant="primary">
            <FaPlus className="me-2" /> Add New Book
          </Button>
        </LinkContainer>
      </div>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {/* Advanced Filters */}
          <Form className={styles['advanced-filters']}>
            <div className="form-group">
              <Form.Label>Category</Form.Label>
              <Form.Select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPageNumber(1); }}>
                <option value="">All</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="form-group">
              <Form.Label>Stock</Form.Label>
              <Form.Select value={filterStock} onChange={e => { setFilterStock(e.target.value); setPageNumber(1); }}>
                <option value="">All</option>
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </Form.Select>
            </div>
            <div className="form-group">
              <Form.Label>Price</Form.Label>
              <Form.Select value={filterPrice} onChange={e => { setFilterPrice(e.target.value); setPageNumber(1); }}>
                <option value="">All</option>
                <option value="low">Low to High</option>
                <option value="high">High to Low</option>
              </Form.Select>
            </div>
            <div className="form-group" style={{ minWidth: 220 }}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Search books..."
                  value={search}
                  onChange={handleSearchChange}
                  aria-label="Search books"
                />
                <Button variant="outline-secondary" type="submit" onClick={handleSearchSubmit}>
                  <FaSearch />
                </Button>
              </InputGroup>
            </div>
            <div className="text-muted align-self-center" style={{ marginLeft: 'auto', fontSize: 15 }}>
              Page {page} of {pages}
            </div>
          </Form>

          {/* Grid Layout */}
          <div className={styles['admin-books-grid']}>
            {books.map((book) => (
              <div className={styles['admin-book-card']} key={book._id}>
                <div className={styles['admin-book-title']}>{book.name}</div>
                <div className={styles['admin-book-meta']}>
                  <span className={styles['admin-book-badge']}>{book.category}</span>
                  <span className={styles['admin-book-badge']}>{book.brand}</span>
                </div>
                <div className={styles['admin-book-meta']}>Price: <b>${book.price}</b></div>
                <div className={styles['admin-book-meta']}>
                  Stock: <span className={styles['admin-book-badge']} style={{ background: book.countInStock > 0 ? '#e0ffe0' : '#ffe0e0', color: book.countInStock > 0 ? '#0a0' : '#a00' }}>{book.countInStock > 0 ? book.countInStock : 'Out'}</span>
                </div>
                <div className={styles['admin-book-actions']}>
                  <LinkContainer to={`/admin/book/${book._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(book._id)}
                  >
                    <FaTrash style={{ color: 'var(--color-textInverted, #fff)' }} />
                  </Button>
                </div>
                <div className={styles['admin-book-meta']} style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>
                  ID: {book._id.substring(0, 10)}...
                </div>
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                />
                {page > 1 && (
                  <Pagination.Item onClick={() => setPageNumber(page - 1)}>{page - 1}</Pagination.Item>
                )}
                <Pagination.Item active>{page}</Pagination.Item>
                {page < pages && (
                  <Pagination.Item onClick={() => setPageNumber(page + 1)}>{page + 1}</Pagination.Item>
                )}
                <Pagination.Next
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, pages))}
                  disabled={page === pages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default AdminBooks;