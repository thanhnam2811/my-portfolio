'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { profileData } from '@/app/_data/profile';
import { contentData } from '@/app/_data/content';
import { getContactInfo } from '@/app/_data/contact';

const contactHeading = contentData.headings.contact;

export default function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

	// Clear status message after 5 seconds
	useEffect(() => {
		if (submitStatus !== 'idle') {
			const timer = setTimeout(() => {
				setSubmitStatus('idle');
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [submitStatus]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus('idle');

		try {
			const response = await fetch('https://getform.io/f/axoywdzb', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSubmitStatus('success');
				setFormData({ name: '', email: '', message: '' });
			} else {
				throw new Error('Failed to send message');
			}
		} catch (error) {
			console.error('Error sending message:', error);
			setSubmitStatus('error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const contactInfo = getContactInfo();

	return (
		<section id="contact" className="w-full max-w-6xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-3xl sm:text-4xl font-bold mb-12 text-center"
			>
				{contactHeading}
			</motion.h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Contact Form */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
				>
					<Card>
						<CardHeader>
							<CardTitle>{contentData.messages.contactForm.title}</CardTitle>
							<CardDescription>{contentData.messages.contactForm.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<input type="hidden" name="_gotcha" style={{ display: 'none !important' }} />
								<div>
									<Label htmlFor="name" className="block text-sm font-medium mb-2">
										Name
									</Label>
									<Input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Your name"
									/>
								</div>
								<div>
									<Label htmlFor="email" className="block text-sm font-medium mb-2">
										Email
									</Label>
									<Input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										placeholder="your.email@example.com"
									/>
								</div>
								<div>
									<Label htmlFor="message" className="block text-sm font-medium mb-2">
										Message
									</Label>
									<Textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={5}
										placeholder="Tell me about your project or opportunity..."
									/>
								</div>
								<Button type="submit" disabled={isSubmitting} className="w-full">
									{isSubmitting
										? contentData.messages.contactForm.submittingButton
										: contentData.messages.contactForm.submitButton}
								</Button>

								{/* Status Messages */}
								{submitStatus === 'success' && (
									<div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
										{contentData.messages.contactForm.successMessage}
									</div>
								)}

								{submitStatus === 'error' && (
									<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
										Failed to send message. Please try again or contact me directly via email.
									</div>
								)}
							</form>
						</CardContent>
					</Card>
				</motion.div>

				{/* Contact Information */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="space-y-8"
				>
					<div>
						{' '}
						<h3 className="text-2xl font-semibold mb-4">
							{contentData.messages.contactSection.workTogether}
						</h3>
						<p className="text-muted-foreground mb-6">{profileData.about.contactDescription}</p>
					</div>

					<div className="space-y-4">
						<h4 className="text-lg font-medium">{contentData.messages.contactSection.contactInfo}</h4>
						{contactInfo.map((info, index) => (
							<motion.div
								key={info.title}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<a
									href={info.href}
									target={info.href.startsWith('http') ? '_blank' : undefined}
									rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
									className="block p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
								>
									<div className="font-medium">{info.title}</div>
									<div className="text-sm text-muted-foreground">{info.value}</div>
								</a>
							</motion.div>
						))}
					</div>

					<div>
						<h4 className="text-lg font-medium mb-3">{contentData.messages.contactSection.availability}</h4>
						<p className="text-muted-foreground">{profileData.availability}</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
