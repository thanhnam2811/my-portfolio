'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getContactInfo } from '@/app/_data/contact';
import { toast } from 'sonner';
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, type LucideIcon } from 'lucide-react';
import { type ContactIconType } from '@/app/_data/contact';
import { useTranslations } from 'next-intl';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const iconMap: Record<ContactIconType, LucideIcon> = {
	github: Github,
	linkedin: Linkedin,
	mail: Mail,
	phone: Phone,
	'map-pin': MapPin,
	'external-link': ExternalLink,
};

export default function Contact() {
	const tContact = useTranslations('Contact');
	const tProfile = useTranslations('Profile');
	const shouldReduceMotion = usePrefersReducedMotion();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch('https://getform.io/f/axoywdzb', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				toast.success(tContact('success'));
				setFormData({ name: '', email: '', message: '' });
			} else {
				throw new Error('Failed to send message');
			}
		} catch {
			toast.error(tContact('error'));
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

	const contactTitleKeys: Record<string, string> = {
		Email: 'email',
		LinkedIn: 'linkedin',
		GitHub: 'github',
	};

	return (
		<section id="contact" data-snap="true" className="section-shell py-24 sm:py-28">
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
				viewport={{ once: true, amount: 0.2 }}
				className="max-w-3xl"
			>
				<p className="section-label mb-4">{tContact('eyebrow')}</p>
				<h2 className="premium-heading text-4xl sm:text-5xl">{tContact('title')}</h2>
			</motion.div>

			<div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.28, delay: shouldReduceMotion ? 0 : 0.04 }}
					viewport={{ once: true, amount: 0.16 }}
					className="editorial-surface p-7 sm:p-8"
				>
					<h3 className="text-2xl font-semibold tracking-tight">{tContact('leadTitle')}</h3>
					<p className="mt-4 text-base leading-8 text-muted-foreground">{tContact('lead')}</p>

					<div className="mt-8 rounded-3xl border border-border bg-background/70 p-5">
						<p className="section-label mb-3">{tContact('directTitle')}</p>
						<p className="text-sm leading-7 text-muted-foreground">{tContact('directDescription')}</p>
					</div>

					<div className="mt-6 grid gap-3">
						{contactInfo.map((info) => {
							const Icon = iconMap[info.icon] ?? ExternalLink;
							const titleKey = contactTitleKeys[info.title] || 'email';
							const externalLinkProps = info.href.startsWith('http')
								? { target: '_blank', rel: 'noopener noreferrer' }
								: {};

							return (
								<a
									key={info.title}
									href={info.href}
									className="flex items-center gap-4 rounded-3xl border border-border bg-background/70 px-5 py-4 transition-colors hover:border-primary/40"
									{...externalLinkProps}
								>
									<div className="rounded-2xl border border-border bg-card p-3 text-primary">
										<Icon className="h-5 w-5" aria-hidden="true" />
									</div>
									<div>
										<p className="section-label mb-1">{tContact(`Titles.${titleKey}`)}</p>
										<p className="text-sm font-medium text-foreground/88">{info.value}</p>
									</div>
								</a>
							);
						})}
					</div>

					<div className="mt-6 grid gap-3 sm:grid-cols-2">
						<div className="rounded-3xl border border-border bg-background/70 p-5">
							<p className="section-label mb-2">{tContact('availability')}</p>
							<p className="text-sm leading-7 text-muted-foreground">{tContact('availabilityValue')}</p>
						</div>
						<div className="rounded-3xl border border-border bg-background/70 p-5">
							<p className="section-label mb-2">{tContact('responseTime')}</p>
							<p className="text-sm leading-7 text-muted-foreground">{tContact('responseTimeValue')}</p>
						</div>
					</div>

					<p className="mt-6 text-sm leading-7 text-muted-foreground">{tProfile('contactDescription')}</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.28, delay: shouldReduceMotion ? 0 : 0.08 }}
					viewport={{ once: true, amount: 0.16 }}
				>
					<Card className="editorial-surface border-none shadow-none">
						<CardHeader>
							<CardTitle className="text-2xl font-semibold tracking-tight">
								{tContact('formTitle')}
							</CardTitle>
							<CardDescription className="text-sm leading-7 text-muted-foreground">
								{tContact('formDescription')}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-5">
								<input type="hidden" name="_gotcha" style={{ display: 'none !important' }} />
								<div>
									<Label htmlFor="name" className="mb-2 block text-sm font-medium">
										{tContact('name')}
									</Label>
									<Input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										autoComplete="name"
										placeholder={tContact('name')}
										className="h-12 rounded-2xl border-border bg-background"
									/>
								</div>
								<div>
									<Label htmlFor="email" className="mb-2 block text-sm font-medium">
										{tContact('email')}
									</Label>
									<Input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										autoComplete="email"
										placeholder="your.email@example.com"
										className="h-12 rounded-2xl border-border bg-background"
									/>
								</div>
								<div>
									<Label htmlFor="message" className="mb-2 block text-sm font-medium">
										{tContact('message')}
									</Label>
									<Textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={6}
										placeholder="..."
										className="rounded-3xl border-border bg-background"
									/>
								</div>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="h-12 w-full rounded-full text-sm font-semibold shadow-md transition-transform duration-200 hover:-translate-y-0.5"
								>
									{isSubmitting ? tContact('sending') : tContact('send')}
								</Button>
							</form>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
