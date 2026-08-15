'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, User } from 'lucide-react';
import { submitReview, getApprovedReviews } from '@/app/actions/reviews';

interface Review {
  id: string;
  rating: number;
  comment: string;
  customer_name: string;
  created_at: string;
}

function parseReviewComment(comment: string) {
  const newMatch = comment.match(/^\[Fabric:\s*(\d)\/5,\s*Comfort:\s*(\d)\/5,\s*Service\s*&\s*Packaging:\s*(\d)\/5\]\s*([\s\S]*)$/);
  if (newMatch) {
    return {
      fabricRating: parseInt(newMatch[1]),
      comfortRating: parseInt(newMatch[2]),
      servicePackagingRating: parseInt(newMatch[3]),
      cleanComment: newMatch[4].trim()
    };
  }

  const oldMatch = comment.match(/^\[Fabric:\s*(\d)\/5,\s*Comfort:\s*(\d)\/5,\s*Service:\s*(\d)\/5,\s*Package:\s*(\d)\/5\]\s*([\s\S]*)$/);
  if (oldMatch) {
    const serviceVal = parseInt(oldMatch[3]);
    const packageVal = parseInt(oldMatch[4]);
    return {
      fabricRating: parseInt(oldMatch[1]),
      comfortRating: parseInt(oldMatch[2]),
      servicePackagingRating: Math.round((serviceVal + packageVal) / 2),
      cleanComment: oldMatch[5].trim()
    };
  }

  return {
    fabricRating: null,
    comfortRating: null,
    servicePackagingRating: null,
    cleanComment: comment
  };
}

export default function ProductReviews({ productId, title = "Customer Feedback" }: { productId?: string, title?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    customerName: '',
    customerEmail: ''
  });
  const [fabricRating, setFabricRating] = useState(5);
  const [comfortRating, setComfortRating] = useState(5);
  const [servicePackagingRating, setServicePackagingRating] = useState(5);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const result = await getApprovedReviews(productId);
    if (result.success) {
      // Sort by rating (highest first) then by date
      const sorted = (result.data || []).sort((a: Review, b: Review) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setReviews(sorted);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const prefix = `[Fabric: ${fabricRating}/5, Comfort: ${comfortRating}/5, Service & Packaging: ${servicePackagingRating}/5] `;
    
    const result = await submitReview({
      productId,
      ...formData,
      comment: prefix + formData.comment
    });

    if (result.success) {
      setSubmissionSuccess(true);
      setShowForm(false);
      setFormData({ rating: 5, comment: '', customerName: '', customerEmail: '' });
      setFabricRating(5);
      setComfortRating(5);
      setServicePackagingRating(5);
      setTimeout(() => setSubmissionSuccess(false), 5000);
    } else {
      alert('Failed to submit review: ' + result.error);
    }
    setIsSubmitting(false);
  };

  const parsedReviews = reviews.map(r => ({
    ...r,
    subRatings: parseReviewComment(r.comment)
  }));

  const reviewsWithSubs = parsedReviews.filter(r => r.subRatings.fabricRating !== null);
  
  const getSubAverage = (key: 'fabricRating' | 'comfortRating' | 'servicePackagingRating') => {
    if (reviewsWithSubs.length === 0) return '0.0';
    const sum = reviewsWithSubs.reduce((acc, r) => acc + (r.subRatings[key] || 0), 0);
    return (sum / reviewsWithSubs.length).toFixed(1);
  };
  
  const fabricAvg = getSubAverage('fabricRating');
  const comfortAvg = getSubAverage('comfortRating');
  const servicePackagingAvg = getSubAverage('servicePackagingRating');

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Display only 4 highest reviews on page
  const featuredReviews = reviews.slice(0, 4);

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-24 border-t border-stone-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
        
        {/* Left: Summary & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60 italic">Real Voices</h2>
            <h3 className="text-4xl font-display font-light text-surface-on leading-tight">{title}</h3>
          </div>

          <div className="p-10 rounded-[40px] bg-stone-50/50 border border-stone-100 flex flex-col items-center justify-center text-center space-y-4 petal-shadow">
            <div className="text-6xl font-display text-primary">{averageRating}</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= Number(averageRating) ? 'fill-primary text-primary' : 'text-stone-200'}`} 
                />
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
              {reviews.length} approved {reviews.length === 1 ? 'review' : 'reviews'}
            </p>

            {reviewsWithSubs.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-stone-100 w-full">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">Detail Ratings</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Fabric Quality', score: fabricAvg },
                    { label: 'Comfort & Fit', score: comfortAvg },
                    { label: 'Service & Packaging', score: servicePackagingAvg }
                  ].map((sub) => (
                    <div key={sub.label} className="flex justify-between items-center text-[10px] font-bold">
                      <span className="uppercase tracking-wider text-stone-500">{sub.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= Math.round(Number(sub.score)) ? 'fill-primary text-primary' : 'text-stone-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-primary font-bold">{sub.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="mt-4 px-8 py-4 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/10"
            >
              {showForm ? 'Cancel Feedback' : 'Share Your Experience'}
            </button>
          </div>

          {submissionSuccess && (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-4 animate-slide-up">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <p className="text-sm font-medium">Thank you! Your feedback is received and awaiting moderation.</p>
            </div>
          )}
        </div>

        {/* Right: Reviews List or Form */}
        <div className="lg:col-span-2">
          {showForm ? (
            <form onSubmit={handleSubmit} className="p-10 rounded-[40px] bg-white border border-stone-100 space-y-8 animate-fade-in shadow-2xl shadow-stone-200/40">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Your Rating</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={`transition-all hover:scale-110 ${formData.rating >= star ? 'text-primary scale-110' : 'text-stone-200'}`}
                      >
                        <Star className={`w-8 h-8 ${formData.rating >= star ? 'fill-primary' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Fabric Quality</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFabricRating(star)}
                          className={`transition-all hover:scale-110 ${fabricRating >= star ? 'text-primary' : 'text-stone-200'}`}
                        >
                          <Star className={`w-5 h-5 ${fabricRating >= star ? 'fill-primary' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Comfort & Fit</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setComfortRating(star)}
                          className={`transition-all hover:scale-110 ${comfortRating >= star ? 'text-primary' : 'text-stone-200'}`}
                        >
                          <Star className={`w-5 h-5 ${comfortRating >= star ? 'fill-primary' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Service & Packaging</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setServicePackagingRating(star)}
                          className={`transition-all hover:scale-110 ${servicePackagingRating >= star ? 'text-primary' : 'text-stone-200'}`}
                        >
                          <Star className={`w-5 h-5 ${servicePackagingRating >= star ? 'fill-primary' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Display Name</label>
                    <input 
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      placeholder="e.g. Sarah J."
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-primary/30 transition-all font-medium text-surface-on"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email (Internal only)</label>
                    <input 
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                      placeholder="sarah@example.com"
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-primary/30 transition-all font-medium text-surface-on"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Your Story</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    placeholder="Tell us what you loved about this piece..."
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-3xl outline-none focus:border-primary/30 transition-all font-light text-surface-on leading-relaxed resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-white rounded-full font-bold uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-50 shadow-xl shadow-primary/20"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Submit Feedback
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex flex-col gap-8 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="h-40 bg-stone-50 rounded-[40px]" />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="p-16 rounded-[40px] bg-stone-50/30 border border-dashed border-stone-200 flex flex-col items-center justify-center text-center space-y-4">
                  <MessageSquare className="w-12 h-12 text-stone-200" />
                  <p className="text-stone-400 font-light italic">Be the first to share your experience with this piece.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {featuredReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}

                  {reviews.length > 4 && (
                    <button 
                      onClick={() => setShowAllModal(true)}
                      className="w-full py-6 rounded-[30px] border border-dashed border-primary/20 text-primary font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary/5 transition-all flex items-center justify-center gap-3"
                    >
                      View All {reviews.length} Experiences
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
            onClick={() => setShowAllModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">
            <div className="px-8 pt-8 pb-6 flex justify-between items-center border-b border-stone-50">
              <div className="space-y-1">
                <h3 className="text-2xl font-display text-surface-on">All Testimonials</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{reviews.length} Experiences Shared</p>
              </div>
              <button 
                onClick={() => setShowAllModal(false)}
                className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center hover:bg-stone-50 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto scrollbar-hide space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            <div className="p-8 border-t border-stone-50 bg-stone-50/30 text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Bloomina Community • Built on Trust
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { fabricRating, comfortRating, servicePackagingRating, cleanComment } = parseReviewComment(review.comment);

  return (
    <div className="p-10 rounded-[40px] bg-white border border-stone-100 space-y-6 transition-all hover:petal-shadow animate-fade-in group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-primary/40 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-bold text-surface-on">{review.customer_name}</h5>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
              {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`w-4 h-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-stone-200'}`} 
            />
          ))}
        </div>
      </div>

      {fabricRating !== null && (
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-stone-50 text-[10px] uppercase tracking-wider text-stone-400 font-bold">
          <div>
            <div className="text-stone-500 mb-0.5">Fabric</div>
            <div className="text-primary font-bold">{fabricRating}/5</div>
          </div>
          <div>
            <div className="text-stone-500 mb-0.5">Comfort & Fit</div>
            <div className="text-primary font-bold">{comfortRating}/5</div>
          </div>
          <div>
            <div className="text-stone-500 mb-0.5">Service & Packaging</div>
            <div className="text-primary font-bold">{servicePackagingRating}/5</div>
          </div>
        </div>
      )}

      <p className="text-surface-on-variant font-light leading-relaxed italic">
        "{cleanComment}"
      </p>
    </div>
  );
}

