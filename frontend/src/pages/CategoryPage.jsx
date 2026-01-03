import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';
import { useGetBooksQuery } from '../redux/slices/booksApiSlice';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import styles from './CategoryPage.module.css';
import Product from '../components/Product';

const CategoryPage = () => {
  const { slug } = useParams();
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategoriesQuery({ pageNumber: 1, pageSize: 1000 });
  const { data: booksData, isLoading: loadingBooks } = useGetBooksQuery();

  // Find the category by slug (case-insensitive, safe)
  const category = categoriesData?.categories?.find(
    (cat) => cat?.slug && slug && cat.slug.toLowerCase() === slug.toLowerCase()
  );
  const books = booksData?.books?.filter(
    (book) => book?.category && category?.name && book.category.toLowerCase() === category.name.toLowerCase()
  ) || [];

  if (loadingCategories || loadingBooks) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!category) return <Alert variant="warning" className="mt-5">Category not found.</Alert>;

  return (
    <Container className="py-4">
      <div className={styles['category-split-view']}>
        <aside className={styles['category-desc-panel']}>
          <div className={styles['category-desc-title']}>{category.name}</div>
          <div className={styles['category-desc-meta']}>Total books: {books.length}</div>
          <div>{category.description || 'No description available for this category.'}</div>
        </aside>
        <section className={styles['category-books-panel']}>
          {books.length === 0 ? (
            <Alert variant="info">No books found in this category.</Alert>
          ) : (
            <Row xs={1} sm={2} md={3} lg={3} className="g-4">
              {books.map((book) => (
                <Col key={book._id}>
                  <Product product={book} />
                </Col>
              ))}
            </Row>
          )}
        </section>
      </div>
    </Container>
  );
};

export default CategoryPage;
