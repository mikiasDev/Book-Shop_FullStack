
import React from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaBook, FaDollarSign, FaShoppingCart, FaUserPlus, FaExclamationTriangle, FaDownload, FaUser } from 'react-icons/fa';
import { useGetAnalyticsSummaryQuery } from '../redux/slices/analyticsApiSlice';
import { useGetRecentActivityQuery } from '../redux/slices/activityApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4a00e0', '#ffb300', '#28a745', '#8e2de2', '#ff5e14'];

const MetricCard = ({ stat }) => (
	<Card className="text-center shadow-sm border-0 h-100">
		<Card.Body className="py-3">
			<div className="mb-2" style={{ fontSize: '2rem', color: stat.color }}>
				{stat.icon}
			</div>
			<div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{stat.title}</div>
			<div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
		</Card.Body>
	</Card>
);

const AdminAnalytics = () => {
	const { data: stats, isLoading, error } = useGetAnalyticsSummaryQuery();
	const { data: activityLogs, isLoading: loadingActivity, error: errorActivity } = useGetRecentActivityQuery();

	if (isLoading) return <Loader />;
	if (error) return <Message variant="danger">Error loading analytics data</Message>;

	const dashboardStats = [
		{ title: 'Total Books', value: stats?.bookCount || 0, icon: <FaBook />, color: '#4a00e0' },
		{ title: 'Sales Revenue', value: `$${stats?.sales?.toFixed(2) || '0.00'}`, icon: <FaDollarSign />, color: '#28a745' },
		{ title: 'Pending Orders', value: stats?.orderCount || 0, icon: <FaShoppingCart />, color: '#ffb300' },
		{ title: 'New Users', value: stats?.userCount || 0, icon: <FaUserPlus />, color: '#0dcaf0' },
		{ title: 'Low Stock', value: stats?.lowStock || 0, icon: <FaExclamationTriangle />, color: '#dc3545' },
		{ title: 'Total Downloads', value: stats?.downloadCount || 0, icon: <FaDownload />, color: '#6c757d' },
	];

	const salesData = stats?.monthlySales || [
		{ month: 'Jan', sales: 0 },
		{ month: 'Feb', sales: 0 },
		{ month: 'Mar', sales: 0 },
		{ month: 'Apr', sales: 0 },
		{ month: 'May', sales: 0 },
		{ month: 'Jun', sales: 0 },
		{ month: 'Jul', sales: 0 },
		{ month: 'Aug', sales: 0 },
		{ month: 'Sep', sales: 0 },
		{ month: 'Oct', sales: 0 },
		{ month: 'Nov', sales: 0 },
		{ month: 'Dec', sales: 0 },
	];
	const categoryData = stats?.categorySales || [
		{ name: 'Fiction', value: 0 },
		{ name: 'Non-Fiction', value: 0 },
		{ name: 'Children', value: 0 },
		{ name: 'Other', value: 0 },
	];
	const topBooks = stats?.topBooks || [];

	let recentActivities = [];
	if (loadingActivity) {
		recentActivities = [{ _id: 'loading', action: 'Loading activity...', user: { name: '' }, createdAt: '' }];
	} else if (errorActivity) {
		recentActivities = [{ _id: 'error', action: 'Failed to load activity', user: { name: '' }, createdAt: '' }];
	} else if (activityLogs && activityLogs.length > 0) {
		recentActivities = activityLogs;
	} else {
		recentActivities = [{ _id: 'none', action: 'No recent activity', user: { name: '' }, createdAt: '' }];
	}

	return (
		<div className="container-fluid py-3">
			{/* Metrics */}
			<Row className="g-3 mb-4">
				{dashboardStats.map((stat) => (
					<Col key={stat.title} xs={6} sm={4} md={4} lg={2}>
						<MetricCard stat={stat} />
					</Col>
				))}
			</Row>

			{/* Top Books */}
			<Row className="mb-4">
				<Col xs={12}>
					<Card className="shadow-sm border-0">
						<Card.Body>
							<h5 className="mb-3">Top 5 Books by Sales</h5>
							<ListGroup variant="flush">
								{topBooks.length > 0 ? (
									topBooks.map((book, idx) => (
										<ListGroup.Item key={book._id || idx} className="border-0 py-2 px-0">
											<div className="d-flex justify-content-between align-items-center">
												<span><strong>{book.name}</strong></span>
												<span className="badge bg-primary">Sold: {book.totalSold}</span>
												<span className="badge bg-success">Revenue: ${book.totalRevenue}</span>
											</div>
										</ListGroup.Item>
									))
								) : (
									<ListGroup.Item className="border-0 py-2 px-0 small text-muted">No sales data available.</ListGroup.Item>
								)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Charts */}
			<Row className="g-4 mb-4">
				<Col xs={12} md={6}>
					<Card className="h-100 p-2">
						<Card.Body>
							<h5 className="mb-3">Monthly Sales</h5>
							<div style={{ height: 240 }}>
								<ResponsiveContainer width="100%" height={210}>
									<LineChart data={salesData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
										<XAxis dataKey="month" />
										<YAxis />
										<Tooltip formatter={v => `$${v}`} />
										<Line type="monotone" dataKey="sales" stroke="#4a00e0" strokeWidth={2} dot={{ r: 3 }} name="Sales" />
									</LineChart>
								</ResponsiveContainer>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xs={12} md={6}>
					<Card className="h-100 p-2">
						<Card.Body>
							<h5 className="mb-3">Top Categories by Sales</h5>
							<div style={{ height: 240 }}>
								<ResponsiveContainer width="100%" height={210}>
									<PieChart>
										<Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#4a00e0" label={({ name, value }) => `${name}: $${value}`}
											labelLine={false} />
										<Tooltip formatter={v => `$${v}`} />
										<Legend verticalAlign="bottom" height={36} iconType="circle" />
										{categoryData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</PieChart>
								</ResponsiveContainer>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Recent Activity */}
			<Row>
				<Col xs={12}>
					<Card className="shadow-sm border-0">
						<Card.Body>
							<h5 className="mb-3">Recent Activity</h5>
							<ListGroup variant="flush">
								{recentActivities && recentActivities.length > 0 && recentActivities[0]._id !== 'none' && recentActivities[0]._id !== 'loading' && recentActivities[0]._id !== 'error' ? (
									recentActivities.map((activity) => (
										<ListGroup.Item key={activity._id || activity.id} className="border-0 py-3 px-0">
											<div className="d-flex justify-content-between align-items-start">
												<div>
													<strong>{activity.action}</strong>
													<div className="small text-muted">
														<FaUser className="me-1" size={12} /> {activity.user?.name || ''}
													</div>
												</div>
												<span className="rounded-pill px-3 py-1 ms-2 bg-light border" style={{ fontWeight: 500, fontSize: '0.92rem' }}>
													{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ''}
												</span>
											</div>
										</ListGroup.Item>
									))
								) : (
									<ListGroup.Item className="border-0 py-3 px-0 small text-muted">
										{recentActivities[0]._id === 'none' && 'No recent activity. All quiet!'}
										{recentActivities[0]._id === 'loading' && 'Loading recent activity...'}
										{recentActivities[0]._id === 'error' && 'Could not load activity. Please try again later.'}
									</ListGroup.Item>
								)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default AdminAnalytics;