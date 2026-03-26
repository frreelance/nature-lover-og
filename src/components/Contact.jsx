"use client";
<section id="contact" className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                📞 Get In Touch
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
              Contact{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                Nature Lovers
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ready to transform your garden? Get in touch with our expert team for personalized plant recommendations and professional gardening services.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Email Contact */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8 border border-green-100">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                Email Us
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Send us your questions and we'll get back to you within 24 hours.
              </p>
              <a 
                href="mailto:naturelovers636@gmail.com"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 group/link"
              >
                <span>naturelovers636@gmail.com</span>
                <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
              </a>
            </div>

            {/* Phone Contact */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8 border border-green-100">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                Call Us
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Speak directly with our plant experts for immediate assistance.
              </p>
              <a 
                href="tel:+919509899906"
                className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors duration-300 group/link"
              >
                <span>+91 9509899906</span>
                <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
              </a>
            </div>

            {/* Location Contact */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8 border border-green-100 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                Visit Us
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Come visit our nursery and see our beautiful plant collection in person.
              </p>
              <div className="text-purple-600 font-semibold">
                <p>House No.1, 8th Floor</p>
                <p>AARCITY D-Block</p>
                <p>Sec.9-11, Hisar</p>
              </div>
            </div>
          </div>

          {/* Interactive Features Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Interactive Features */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-green-800 mb-6">
                Why Choose Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                  Expert Service?
                </span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                    <Sparkles className="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      Expert Plant Care
                    </h4>
                    <p className="text-gray-600">
                      Our certified horticulturists provide personalized care advice for your specific plants and garden conditions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                    <Star className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      Premium Quality
                    </h4>
                    <p className="text-gray-600">
                      We source only the highest quality plants and gardening supplies from trusted suppliers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
                    <Zap className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      Fast Delivery
                    </h4>
                    <p className="text-gray-600">
                      Quick and safe delivery of your plants with proper packaging to ensure they arrive in perfect condition.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
              <h4 className="text-2xl font-bold text-green-800 mb-6 text-center">
                Send Us a Message
              </h4>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your gardening needs..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
