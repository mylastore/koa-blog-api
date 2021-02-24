'use strict';

var mongoose = require('mongoose');
var shortId = require('shortid');

var user1 = mongoose.Types.ObjectId();
var user2 = mongoose.Types.ObjectId();
var user3 = mongoose.Types.ObjectId();
var user4 = mongoose.Types.ObjectId();
var user5 = mongoose.Types.ObjectId();
var user6 = mongoose.Types.ObjectId();
var user7 = mongoose.Types.ObjectId();
var user8 = mongoose.Types.ObjectId();
var user9 = mongoose.Types.ObjectId();
var user10 = mongoose.Types.ObjectId();
var user11 = mongoose.Types.ObjectId();
var user12 = mongoose.Types.ObjectId();
var user13 = mongoose.Types.ObjectId();
var user14 = mongoose.Types.ObjectId();
var user15 = mongoose.Types.ObjectId();
var user16 = mongoose.Types.ObjectId();
var user17 = mongoose.Types.ObjectId();
var user18 = mongoose.Types.ObjectId();
var user19 = mongoose.Types.ObjectId();
var user20 = mongoose.Types.ObjectId();

var blog1 = mongoose.Types.ObjectId();
var blog2 = mongoose.Types.ObjectId();
var blog3 = mongoose.Types.ObjectId();
var blog4 = mongoose.Types.ObjectId();
var blog5 = mongoose.Types.ObjectId();
var blog6 = mongoose.Types.ObjectId();
var blog7 = mongoose.Types.ObjectId();

var category1 = mongoose.Types.ObjectId();
var category2 = mongoose.Types.ObjectId();
var category3 = mongoose.Types.ObjectId();
var category4 = mongoose.Types.ObjectId();
var category5 = mongoose.Types.ObjectId();

var tag1 = mongoose.Types.ObjectId();
var tag2 = mongoose.Types.ObjectId();
var tag3 = mongoose.Types.ObjectId();
var tag4 = mongoose.Types.ObjectId();
var tag5 = mongoose.Types.ObjectId();

var quote1 = mongoose.Types.ObjectId();
var quote2 = mongoose.Types.ObjectId();
var quote3 = mongoose.Types.ObjectId();
var quote4 = mongoose.Types.ObjectId();
var quote5 = mongoose.Types.ObjectId();

/**
 * Random number generator fuction
 * @returns {number}
 *
 */
function randomNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

module.exports = {
    blogs: [{
        _id: blog1,
        title: 'The database for modern applications',
        slug: 'the-database-for-modern-applications',
        content: 'MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model. ',
        metaTile: 'The database for modern applications',
        metaDescription: 'MongoDB is a document database, which means it stores data in JSON-like...',
        excerpt: 'MongoDB is a document database, which means it stores data in JSON-like documents...',
        avatar: 'seo-default.webp',
        postedBy: user1,
        published: true,
        categories: [category1],
        tags: [tag1]
    }, {
        _id: blog2,
        title: 'The database for modern',
        slug: 'the-database-for-modern',
        content: 'MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model. ',
        metaTile: 'The database for modern applications',
        metaDescription: 'MongoDB is a document database, which means it stores data in JSON-like...',
        excerpt: 'MongoDB is a document database, which means it stores data in JSON-like documents...',
        avatar: 'seo-default.webp',
        postedBy: user2,
        published: true,
        categories: [category2],
        tags: [tag2]
    }, {
        _id: blog3,
        title: 'The database for modern',
        slug: 'the-database-for-modern-face',
        content: 'MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model. ',
        metaTile: 'The database for modern applications',
        metaDescription: 'MongoDB is a document database, which means it stores data in JSON-like...',
        excerpt: 'MongoDB is a document database, which means it stores data in JSON-like documents...',
        avatar: 'seo-default.webp',
        postedBy: user1,
        published: true,
        categories: [category3],
        tags: [tag3]
    }, {
        _id: blog4,
        title: 'The database for modern applications for life',
        slug: 'the-database-for-modern-applications-life',
        content: 'MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model. ',
        metaTile: 'The database for modern applications',
        metaDescription: 'MongoDB is a document database, which means it stores data in JSON-like...',
        excerpt: 'MongoDB is a document database, which means it stores data in JSON-like documents...',
        avatar: 'seo-default.webp',
        postedBy: user2,
        categories: [category4],
        published: true,
        tags: [tag4]
    }, {
        _id: blog5,
        title: 'The database for modern applications cypress',
        slug: 'the-database-for-modern-applications-cypress',
        content: 'MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model. ',
        metaTile: 'The database for modern applications',
        metaDescription: 'MongoDB is a document database, which means it stores data in JSON-like...',
        excerpt: 'MongoDB is a document database, which means it stores data in JSON-like documents...',
        avatar: 'seo-default.webp',
        postedBy: user1,
        published: true,
        categories: [category5],
        tags: [tag5]
    }, {
        _id: blog6,
        title: 'The database for modern applications',
        slug: 'the-database-for-modern-applications',
        content: 'MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model. ',
        metaTile: 'The database for modern applications',
        metaDescription: 'MongoDB is a document database, which means it stores data in JSON-like...',
        excerpt: 'MongoDB is a document database, which means it stores data in JSON-like documents...',
        avatar: 'seo-default.webp',
        postedBy: user3,
        published: false,
        categories: [category5],
        tags: [tag5]
    }, {
        _id: blog7,
        title: 'Unpublished blog',
        slug: 'unpublished-blog',
        content: 'MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model. ',
        metaTile: 'The database for modern applications',
        metaDescription: 'MongoDB is a document database, which means it stores data in JSON-like...',
        excerpt: 'MongoDB is a document database, which means it stores data in JSON-like documents...',
        avatar: 'seo-default.webp',
        postedBy: user1,
        published: false,
        categories: [category5],
        tags: [tag5]
    }],
    users: [{
        _id: user1,
        email: 'me@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'admin',
        about: 'about me...',
        name: 'David',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: '',
        settings: {
            newUser: false,
            newQuote: false
        }
    }, {
        _id: user2,
        email: 'me2@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user3,
        email: 'me3@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user4,
        email: 'me4@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user5,
        email: 'me5@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user6,
        email: 'me6@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user7,
        email: 'me7@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user8,
        email: 'me8@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user9,
        email: 'me9@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user10,
        email: 'me10@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user11,
        email: 'me11@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user12,
        email: 'me12@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user13,
        email: 'me13@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user14,
        email: 'me14@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user15,
        email: 'me15@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user16,
        email: 'me16@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user17,
        email: 'me17@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user18,
        email: 'me18@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user19,
        email: 'me19@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }, {
        _id: user20,
        email: 'me20@me.com',
        avatar: 'https://picsum.photos/id/237/200',
        password: 'Password#1',
        role: 'user',
        name: 'David',
        about: 'about me...',
        username: shortId.generate(),
        location: 'Santa Ana, CA',
        gender: 'Male',
        website: ''
    }],
    categories: [{
        _id: category1,
        name: 'NextJS',
        slug: 'nextjs'
    }, {
        _id: category2,
        name: 'NodeJS',
        slug: 'nodejs'
    }, {
        _id: category3,
        name: 'SvelteJS',
        slug: 'sveltejs'
    }, {
        _id: category4,
        name: 'MongoDB',
        slug: 'mongodb'
    }, {
        _id: category5,
        name: 'ReactJs',
        slug: 'reactjs'
    }],
    tags: [{
        _id: tag1,
        name: 'CSS',
        slug: 'css'
    }, {
        _id: tag2,
        name: 'SASS',
        slug: 'sass'
    }, {
        _id: tag3,
        name: 'oAuth',
        slug: 'oauth'
    }, {
        _id: tag4,
        name: 'npm',
        slug: 'npm'
    }, {
        _id: tag5,
        name: 'git',
        slug: 'git'
    }],
    quotes: [{
        _id: quote1,
        name: 'Bratislava',
        email: 'email1@email.com',
        phone: '818-555-1111',
        company: 'mysite.com',
        message: 'Some description of this event. I dont know what to talk about'
    }, {
        _id: quote2,
        name: 'Monica L',
        email: 'email2@email.com',
        phone: '818-555-2222',
        website: 'mysite.com',
        message: 'Some description of this event. I dont know what to talk about'
    }, {
        _id: quote3,
        name: 'Bristol M',
        email: 'email3@email.com',
        phone: '818-555-3333',
        website: 'mysite.com',
        message: 'Some description of this event. I dont know what to talk about'
    }, {
        _id: quote4,
        name: 'Jose M',
        email: 'email4@email.com',
        phone: '818-555-4444',
        website: 'mysite.com',
        message: 'Some description of this event. I dont know what to talk about'
    }, {
        _id: quote5,
        name: 'Luck Joe',
        email: 'email5@email.com',
        phone: '818-555-5555',
        website: 'mysite.com',
        message: 'Some description of this event. I dont know what to talk about'
    }]
};