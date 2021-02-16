import Token from '../models/InstagramToken'
import fetch from 'node-fetch'
import Quote from "../models/Quote"
import querystring from 'querystring'


const API_URL = "https://graph.instagram.com/me/media?fields="
const API_FIELDS = "caption,media_url,media_type,permalink,timestamp,username"

const authURl = "https://api.instagram.com/oauth/authorize?"
const accessTokenURl = "https://api.instagram.com/oauth/access_token"



let redirectUri = 'http://localhost:4002/processAuthorization'

const appID = process.env.MY_LA_STORE_INSTAGRAM_APP_ID
const redirectURI = process.env.MY_LA_STORE_INSTAGRAM_APP_REDIRECT_URI
const appSecret = process.env.MY_LA_STORE_INSTAGRAM_APP_SECRET

const instagramGraphApiUrl = "https://graph.instagram.com/"
const queryUrl = "me/media?fields=id,username,timestamp,caption,media_url,media_type,permalink&access_token={userToken}"

class InstagramController {

    async authorizeUser(ctx) {
        const params = {
            client_id: appID,
            redirect_uri: redirectURI,
            scope: "user_profile,user_media",
            response_type: "code"
        }
        const redirectURl = authURl + querystring.stringify(params)
        console.log(redirectURl)

        ctx.body = {status: 200, url: redirectURl}
    }

    async getUserAccessToken(ctx){
        const {code} = ctx.request.body
        console.log('code token? ',code)
        // const graphURL = "https://graph.instagram.com/refresh_access_token?"
        // const params = {
        //     grant_type: "ig_refresh_token",
        //     access_token: code
        // }
        // const apiUrl = graphURL + JSON.stringify(params)
        //
        //
        // console.log(apiUrl)
        const response = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${code}`, {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        });


        const data = await response.json();

        console.log(data);
        ctx.body = data
    }




}

export default InstagramController


exports.deleteToken = function (req, res) {
    Token.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return console.log(err)
        } else {

            req.flash('success', {msg: 'Token deleted'});
            return res.redirect('/admin/instagram');
        }
    });
};


exports.auth = function (req, res) {
    ig.use({
        client_id: process.env.IG_CLIENT_ID,
        client_secret: process.env.IG_CLIENT_SECRET
    });

    //the redirect uri we set when registering our application
    res.redirect(ig.get_authorization_url(redirectUri, {scope: ['basic', 'likes']}));

};

exports.processAuthorization = function (req, res) {
    //retrieves the code that was passed along as a query to the '/handleAuth' route and uses this code to construct an access token
    ig.authorize_user(req.query.code, redirectUri, function (err, result) {
        if (err) res.send(err);

        const token = new Token({
            token: result.access_token
        });

        token.save(function (err, next, result) {
            if (err) {
                console.log(err.message);
                req.flash('error', {msg: err.message});
                return res.redirect('/admin/instagram/index');
            } else {
                req.flash('success', {msg: 'Success'});
                res.redirect('/admin/instagram');
            }
        });
    });

};

exports.getGallery = function (req, res) {
    Token
        .find()
        .exec(function (err, data) {
            console.log('data resp', data);

            if (data.length > 0) {
                const accessToken = data;

                ig.use({
                    access_token: accessToken
                });

                ig.user_media_recent(accessToken.split('.')[0], function (err, result, pagination, remaining, limit) {
                    if (err) {
                        res.json(err)
                    } else {
                        res.render('instagram/index', {
                            robots: 'noindex, nofollow',
                            title: 'Gallery',
                            instagram: result,
                        });
                    }
                });
            } else {
                console.log('ERROR!')
                res.render('instagram/index', {
                    robots: 'noindex, nofollow',
                    title: 'Gallery',
                    empty: 'Working on galleries...',
                });

            }
        });
};

exports.getCarousel = function (req, res) {
    const link = req.query.link + '?__a=1';
    fetch(link)
        .then(res => res.json())
        .then((data) => {
            if (data) {
                res.render('instagram/carousel', {
                    robots: 'noindex, nofollow',
                    title: 'Gallery Carousel',
                    data: data.graphql.shortcode_media.edge_sidecar_to_children.edges
                });
            }
        })
        .catch(err => {
            throw err
        });
};
