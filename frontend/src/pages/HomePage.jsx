import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Grid, Button, Typography, Box } from '@mui/material';
import { Row, Col, Form } from 'react-bootstrap';
import { motion } from 'framer-motion'; 
import Slider from 'react-slick'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaShippingFast, FaHeadset, FaBookOpen, FaGlobe, FaFlask, FaChild, FaMagic, FaQuoteLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import Product from '../components/books/BookCard';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { useGetBooksQuery } from '../redux/slices/booksApiSlice';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';

import BookFilter from '../components/books/BookFilter';

const HomePage = () => {
  // 1. GET KEYWORD AND CATEGORY FROM URL (For Search Functionality)
  const { keyword, category } = useParams();

  // Advanced filter state
  const [filters, setFilters] = useState({
    keyword: keyword || '',
    author: '',
    category: category || '',
    language: '',
    minPrice: '',
    maxPrice: '',
  });

  // Update filters if URL param changes (for category navigation)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      keyword: keyword || '',
      category: category || '',
    }));
  }, [keyword, category]);

  // 2. FETCH BOOKS (Pass all filters)
  // Only send non-empty filters to backend
  const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined));
  const { data: books, isLoading, error } = useGetBooksQuery(activeFilters);
  const { data: categoriesListData } = useGetCategoriesQuery();

  // Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  const testimonials = [
    { name: "Amanuel T.", role: "Book Lover", img: "https://i.pravatar.cc/150?img=11", text: "Found rare books I couldn’t get anywhere else. The delivery was super fast!" },
    { name: "Saba M.", role: "Student", img: "https://i.pravatar.cc/150?img=5", text: "Hibr is my go-to for academic books. The prices are unbeatable." },
    { name: "Kebede B.", role: "Non-fiction Fan", img: "https://i.pravatar.cc/150?img=3", text: "The collection of non-fiction is impressive. Highly recommended." },
    { name: "Tigist H.", role: "Mom of 2", img: "https://i.pravatar.cc/150?img=9", text: "My kids love the children's section. The illustrations are beautiful." },
    { name: "Dawit L.", role: "Tech Lead", img: "https://i.pravatar.cc/150?img=13", text: "Great technical books selection. Helped me level up my coding skills." },
    { name: "Hanna Y.", role: "Book Club Host", img: "https://i.pravatar.cc/150?img=24", text: "We order our monthly reads from here. Customer service is top-notch!" },
  ];



  // --- CONDITIONAL RENDER: SEARCH/FILTER RESULTS MODE ---
  const showResults = filters.keyword || filters.author || filters.category || filters.language || filters.minPrice || filters.maxPrice;
  if (showResults) {
    const handleBackToHome = () => setFilters({ keyword: '', author: '', category: '', language: '', minPrice: '', maxPrice: '' });
    return (
      <Box component="main" sx={{ pt: 10, minHeight: '80vh', bgcolor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button onClick={handleBackToHome} variant="outlined" sx={{ mr: 2, borderRadius: '50%' }}><FaArrowRight style={{ transform: 'rotate(180deg)' }} /></Button>
            <Typography variant="h4" fontWeight={700}>Search & Filter Results</Typography>
          </Box>
          {/* BookFilter remains as is, or can be refactored to MUI later */}
          <BookFilter
            onSearch={(newFilters) => setFilters({ ...filters, ...newFilters })}
            categories={Array.isArray(categoriesListData?.categories) ? categoriesListData.categories : []}
          />
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error?.data?.message || error.error}</Message>
          ) : books.length === 0 ? (
            <div className="text-center py-5">
              <h3>No books found.</h3>
              <p className="text-muted">Try searching for your favorite genre or author.</p>
              <Button onClick={handleBackToHome} className="btn btn-primary mt-3">Back to Home</Button>
            </div>
          ) : (
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                  <Product book={book} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    );
  }

  // --- DEFAULT RENDER: FULL HOME PAGE ---
  return (
    <Box component="main" sx={{ pt: 10, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* HERO SECTION */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 8, mb: 6, borderRadius: '0 0 50px 50px' }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4} sx={{ minHeight: '60vh' }}>
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle1" sx={{ mb: 2, bgcolor: 'warning.main', color: 'warning.contrastText', px: 2, py: 1, borderRadius: 2, fontWeight: 'bold', display: 'inline-block' }}>#1 Bookstore in Ethiopia</Typography>
              <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
                Find Your Next <br /> <Box component="span" sx={{ color: 'warning.main' }}>Great Adventure</Box>
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.8 }}>
                Discover over 50+ curated titles across all genres and interests.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: 8, fontWeight: 'bold' }}>
                  Shop Now <FaArrowRight style={{ marginLeft: 8 }} />
                </Button>
                <Button component={Link} to="/search" variant="outlined" color="inherit" size="large" sx={{ borderRadius: 8 }}>
                  Explore Genres
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
              <Box component="img"
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600"
                alt="Hero Book"
                sx={{ width: '100%', maxWidth: 350, borderRadius: 4, boxShadow: 3, transform: 'rotate(-5deg)', border: '5px solid rgba(255,255,255,0.2)' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <>
            {/* STATS ROW */}
            <Row className="g-4 mb-5 justify-content-center" style={{ marginTop: '-80px' }}>
                {[
                    { icon: <FaShippingFast />, title: "Quick Delivery", text: "Within 24 Hours" },
                    { icon: <FaStar />, title: "Best Ratings", text: "4.9/5 Average" },
                    { icon: <FaHeadset />, title: "24/7 Support", text: "We're here for you" }
                ].map((stat, idx) => (
                    <Col md={3} key={idx}>
                        <motion.div 
                            className="bg-white p-4 rounded-4 shadow text-center h-100"
                            whileHover={{ y: -5 }}
                            style={{ borderBottom: '4px solid #0d6efd' }}
                        >
                            <div className="fs-2 text-primary mb-2">{stat.icon}</div>
                            <h5 className="fw-bold">{stat.title}</h5>
                            <small className="text-muted">{stat.text}</small>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* CATEGORIES GRID */}
            <div className="my-5 py-5 bg-light rounded-5 p-4 p-md-5">
              <div className="text-center mb-5">
                  <h2 className="section-title-modern">Browse Categories</h2>
                  <p className="text-muted">Explore our extensive collection across various genres</p>
              </div>
              <Row className="g-4">
                {(Array.isArray(categoriesListData?.categories) && categoriesListData.categories.length > 0)
                  ? categoriesListData.categories.map((cat) => (
                  <Col key={cat._id} xs={6} md={4} lg={2}>
                     <Link to={`/search/${cat.name}`} className="text-decoration-none text-dark">
                        <motion.div 
                            className="category-card bg-white p-4 rounded-4 text-center shadow-sm h-100"
                            whileHover={{ scale: 1.05 }}
                        >
                          <div className="fs-1 mb-3">
                            {cat.name.toLowerCase().includes('science') ? <FaFlask className="text-danger"/> :
                             cat.name.toLowerCase().includes('child') ? <FaChild className="text-warning"/> :
                             cat.name.toLowerCase().includes('fantasy') ? <FaMagic className="text-info"/> :
                             cat.name.toLowerCase().includes('history') ? <FaGlobe className="text-success"/> :
                             <FaBookOpen className="text-primary"/>}
                          </div>
                          <h6 className="fw-bold mb-0">{cat.name}</h6>
                        </motion.div>
                     </Link>
                  </Col>
                ))
                  : <Col xs={12}><div className="text-center text-muted">No categories available.</div></Col>
                }
              </Row>
            </div>

            {/* DYNAMIC CATEGORY SECTIONS */}
            {(Array.isArray(categoriesListData?.categories) ? categoriesListData.categories : []).map((cat) => {
                const catBooks = books ? books.filter(b => b.category === cat.name).slice(0, 4) : [];
                if (catBooks.length === 0) return null;

                return (
                    <div className="my-5" key={cat._id}>
                        <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                            <h2 className="fw-bold m-0 text-primary">{cat.name}</h2>
                            <Link to={`/search/${cat.name}`} className="btn btn-outline-primary rounded-pill btn-sm">View All</Link>
                        </div>
                        <Row>
                            {catBooks.map((book) => (
                                <Col key={book._id} sm={12} md={6} lg={3}>
                                    <Product book={book} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                );
            })}

            {/* TESTIMONIALS */}
            <div className="my-5 py-5">
                <div className="text-center mb-5">
                    <h2 className="section-title-modern">What Our Readers Say</h2>
                </div>
                <Slider {...sliderSettings} className="px-2">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="testimonial-slide">
                            <div className="testimonial-card-modern">
                                <img src={t.img} alt={t.name} className="user-avatar shadow" />
                                <FaQuoteLeft className="text-primary opacity-25 fs-1 mb-3" />
                                <p className="fst-italic text-muted mb-3">"{t.text}"</p>
                                <h6 className="fw-bold mb-0">{t.name}</h6>
                                <small className="text-primary fw-bold">{t.role}</small>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* NEWSLETTER */}
            <motion.div 
                className="my-5 p-5 rounded-5 text-white text-center position-relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                whileHover={{ scale: 1.01 }}
            >
                <div className="position-relative z-1">
                    <h2 className="fw-bold mb-3">Stay Updated</h2>
                    <p className="mb-4 opacity-75">Subscribe to get the latest book news and exclusive offers!</p>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <Form className="d-flex gap-2 bg-white p-1 rounded-pill">
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="border-0 rounded-pill px-4 shadow-none" 
                                />
                                <Button variant="dark" className="rounded-pill px-4 fw-bold">Subscribe</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </motion.div>

          </>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;