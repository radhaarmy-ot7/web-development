import { motion } from 'framer-motion';
import { Award, Users, Globe, TrendingUp } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const About = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Globe, value: '30+', label: 'Countries Shipped' },
    { icon: Award, value: '100%', label: 'Quality Guarantee' },
    { icon: TrendingUp, value: '4.9', label: 'Average Rating' },
  ];

  const values = [
    {
      title: "Minimalist Philosophy",
      description: "We believe that less is more. Every product is carefully curated to serve a purpose while maintaining aesthetic purity."
    },
    {
      title: "Quality Craftsmanship",
      description: "We partner with artisans who share our commitment to excellence. Every detail matters."
    },
    {
      title: "Sustainable Future",
      description: "We design products that last, reducing waste and promoting mindful consumption."
    }
  ];

  return (
    <PageTransition>
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop&q=80" alt="About" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Story</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
            Founded in 2020, NOIR was born from a simple idea: create beautiful, functional products that stand the test of time.
          </p>
        </motion.div>
      </section>

      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Believe</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our core values guide every decision we make.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative aspect-[21/9] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&auto=format&fit=crop&q=80" alt="Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Join Our Journey</h3>
              <p className="text-gray-300">We're always looking for passionate individuals</p>
            </div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
};