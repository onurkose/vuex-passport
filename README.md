---


---

<h1 id="vuex-passport">Vuex Passport</h1>
<h2 id="prolouge">Prolouge</h2>
<p>This repo is forked from <strong><a href="https://github.com/Vandcarlos/vuex-passport">vandcarlos/vuex-passport</a></strong>. I’d like to speed up a little bit since he took it somewhere nice.</p>
<p>Intentions :</p>
<ul>
<li>Keep it simple, yet effective</li>
<li>Build as a component,</li>
</ul>
<p>When/why you need:</p>
<ul>
<li>If you eager to use Laravel Passport instead of jwt-auth</li>
<li>Tired of trying to implement intentionaly large Vue auth modules to your applications.</li>
</ul>
<p>Important:</p>
<ul>
<li>This module relies on <strong><a href="https://github.com/robinvdvleuten/vuex-persistedstate">vuex-persistedstate</a></strong> to keep auth data persisted on store. You should check it how to install/use because you can’t see it in this repo.</li>
<li>Also I’ve used <strong><a href="https://github.com/axios/axios">axios</a></strong> by default to communicate.</li>
</ul>
<h2 id="installation">Installation</h2>
<p>Just do the trick. You know the npm i -S drill.</p>
<h2 id="usage">Usage</h2>
<p>For simple use import this module and use in store/index.js</p>
<p>Enhancements with vuex-persistedstate, vue-router and so on…</p>
<pre><code>import Vue from 'vue' import Vuex from 'vuex'
import auth from 'vuex-passport'

Vue.use(Vuex);
const store = new Vuex.Store({ 
	modules: { 
		auth
	}
});
export default store;
</code></pre>
<h2 id="route-interceptor">Route interceptor</h2>
<p>if you need intercept guarded routes you can import a RouteShielding, eg.:</p>
<pre><code> import Vue from 'vue' import VueRouter from 'vue-router'
 import { RouteShielding } from 'vuex-passport'
 import routes from './routes'
 Vue.use(VueRouter);
 const Router = new VueRouter({ routes });
 const authLoginRedirect = 'oauth/token', // used when user try to access a guarded route
     authDashboardRedirect = 'dashboard'; // used when user try to access authLoginRedirect route
     
 Router.beforeEach(RouteShielding(authLoginRedirect, authDashboardRedirect));
 export default Router;
</code></pre>
<p>and in your routes you need simply add a meta { guarded: true }, eg.:</p>
<pre><code>const Router = new Router({  
	routes: [  
	{  
		path: '/welcome',
		redirect: { name: 'welcome' },
		component: require('./components/Welcome.vue'),  
		meta: { guarded: false }
	},  
	{  
		path: '/dashboard',  
		name: 'dashboard',  
		component: require('./components/Dashboard.vue'),  
		meta: { guarded: true }
	},  
	{  
		path: '/some-unauthorised-place',  
		name: 'foo',  
		component: require('./components/Foo.vue'),  
		meta: { guarded: false }  
	},  
	{  
		path: '/auth',  
		component: require('./components/auth/Auth.vue'),  
		meta: { guarded: false },  
		name: 'auth',  
		children: [  
			{  
				path: 'login',  
				component: require('./components/auth/Login.vue'),  
				meta: { guarded: false },  
			},  
			{  
				path: 'register',  
				component: require('./components/auth/Register.vue'),  
				meta: { guarded: false },  
			},  
			{  
				path: 'reset',  
				component: require('./components/auth/PasswordReset.vue'),  
				meta: { guarded: false },  
			}]  
	}]
});
</code></pre>
<p>Note: You will can add meta tag in parent or children</p>
<p>Finally if you need change the default login page for redirect or the index page if user access login page when has section you can call a RouteShielding with the names for these pages</p>
<pre><code>Router.beforeEach(RouteShielding('foo-login', 'bar-index'))  
</code></pre>
<p>IMPORTANT the RouteShielding use the property name of routes</p>
<blockquote>
<p>Written with <a href="https://stackedit.io/">StackEdit</a>.</p>
</blockquote>

