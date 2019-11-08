<template>
    <div class="wrapper">
		<div class="wrapper__content">
            <div class="register">
				<div class="register__top"></div>
				<div class="register__content">
                    <div class="container-fluid">
		                <div class="row">
			                <div class="box-wrapper col-6 col-sm-6 col-md-6 col-lg-6">
				                <div class="box box--orange">
					                <div class="box__wrapper">
                                        <div class="box__header">
                                            <span>New to Habbo? Register here!</span>
                                        </div>
                                        <div class="box__body">
							                <h2 class="main-registration-header">Register Now!</h2>
							                <img src="/assets/images/frank_with_key.gif" align="right">
							                <p>Habbo is an online community that lets you create your own virtual space for you and your friends. With thousands of members already checked in there's always something to do...</p>
							                <div class="date-of-birth-container">
								                <span id="dobError"></span>
                                                <h2 class="middle-registration-header">Please start by entering your birthday</h2>
								                <div class="date-of-birth">
									                <input type="hidden" name="birthday" id="birthday">
                                                    <select class="date-of-bith__input date-of-birth__input--day" id="day" name="day">
                                                        <option value="--">--</option>
                                                        <option value="01">1</option>
                                                        <option value="02">2</option>
                                                        <option value="03">3</option>
                                                        <option value="04">4</option>
                                                        <option value="05">5</option>
                                                        <option value="06">6</option>
                                                        <option value="07">7</option>
                                                        <option value="08">8</option>
                                                        <option value="09">9</option>
                                                        <option value="10">10</option>
                                                        <option value="11">11</option>
                                                        <option value="12">12</option>
                                                        <option value="13">13</option>
                                                        <option value="14">14</option>
                                                        <option value="15">15</option>
                                                        <option value="16">16</option>
                                                        <option value="17">17</option>
                                                        <option value="18">18</option>
                                                        <option value="19">19</option>
                                                        <option value="20">20</option>
                                                        <option value="21">21</option>
                                                        <option value="22">22</option>
                                                        <option value="23">23</option>
                                                        <option value="24">24</option>
                                                        <option value="25">25</option>
                                                        <option value="26">26</option>
                                                        <option value="27">27</option>
                                                        <option value="28">28</option>
                                                        <option value="29">29</option>
                                                        <option value="30">30</option>
                                                        <option value="31">31</option>
                                                    </select>
                                                    <select class="date-of-bith__input date-of-birth__input--month" id="month" name="month">
                                                        <option value="--">--</option>
                                                        <option value="01">January</option>
                                                        <option value="02">February</option>
                                                        <option value="03">March</option>
                                                        <option value="04">April</option>
                                                        <option value="05">May</option>
                                                        <option value="06">June</option>
                                                        <option value="07">July</option>
                                                        <option value="08">August</option>
                                                        <option value="09">September</option>
                                                        <option value="10">October</option>
                                                        <option value="11">November</option>
                                                        <option value="12">December</option>
                                                    </select>
                                                    <select class="date-of-bith__input date-of-birth__input--year" id="year" name="year">
                                                        <option value="--">--</option>
                                                        <option value="2017">2017</option>
                                                        <option value="2016">2016</option>
                                                        <option value="2015">2015</option>
                                                        <option value="2014">2014</option>
                                                        <option value="2013">2013</option>
                                                        <option value="2012">2012</option>
                                                        <option value="2011">2011</option>
                                                        <option value="2010">2010</option>
                                                        <option value="2009">2009</option>
                                                        <option value="2008">2008</option>
                                                        <option value="2007">2007</option>
                                                        <option value="2006">2006</option>
                                                        <option value="2005">2005</option>
                                                        <option value="2004">2004</option>
                                                        <option value="2003">2003</option>
                                                        <option value="2002">2002</option>
                                                        <option value="2001">2001</option>
                                                        <option value="2000">2000</option>
                                                        <option value="1999">1999</option>
                                                        <option value="1998">1998</option>
                                                        <option value="1997">1997</option>
                                                        <option value="1996">1996</option>
                                                        <option value="1995">1995</option>
                                                        <option value="1994">1994</option>
                                                        <option value="1993">1993</option>
                                                        <option value="1992">1992</option>
                                                        <option value="1991">1991</option>
                                                        <option value="1990">1990</option>
                                                        <option value="1989">1989</option>
                                                        <option value="1988">1988</option>
                                                        <option value="1987">1987</option>
                                                        <option value="1986">1986</option>
                                                        <option value="1985">1985</option>
                                                        <option value="1984">1984</option>
                                                        <option value="1983">1983</option>
                                                        <option value="1982">1982</option>
                                                    </select>
                                                    <div class="date-of-birth__buttons">
                                                        <input type="submit" id="submitDateOfBirth" name="submitDateOfBirth" value="Continue Registration" class="date-of-bith__submit">
                                                    </div>
                                                </div>
                                            </div>
							                <h2 class="main-registration-header main-registration-header--push">Top Reasons to Register</h2>
							                <img src="/assets/images/reindeer_1_small.gif" align="right">
							                <br>
                                            <ul>
                                                <li>Create your own Habbo character and Home page</li>
                                                <li>Meet your friends and find new ones</li>
                                                <li>Decorate your own room</li>
                                                <li>It’s more fun than not joining!</li>
                                                <br>
                                                <li>
                                                    <strong>It's completely free!</strong>
                                                </li>
                                            </ul>
						                </div>
					                </div>
				                </div>
			                </div>
			                <div class="box-wrapper col-xs-6 col-sm-6 col-md-6 col-lg-6">
				                <div class="box box--blue">
					                <div class="box__wrapper">
                                        <div class="box__header">
                                            <span>Already have a Habbo? Please log in here!</span>
                                        </div>
                                        <div class="box__body">
                                            <p>If you already have a Habbo account then log in here using your Habbo user name and your password. Your user name and password are the same for here as they are in the Hotel.</p>
                                            <div class="login-container">
                                                <form role="form" method="POST" novalidate="novalidate">
                                                    <div class="login-container__error">
                                                    </div>
                                                    <img src="/assets/images/habbo_key.png" align="left">
                                                    <p>
                                                        <strong>
                                                            <label for="username">MY HABBO NAME</label>
                                                        </strong>
                                                        <input type="text" name="username" id="username" required>
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            <label for="password">PASSWORD</label>
                                                        </strong>
                                                        <input type="password" name="password" id="password" required>
                                                    </p>
                                                    <p>
                                                        <input type="submit" id="submitLogin" name="submitLogin" value="Login" class="login__submit">
                                                    </p>
                                                </form>
                                            </div>
                                            <br>
                                            <h2 class="main-registration-header main-registration-header--push">Forgotten your Password?</h2>
                                            <br>
                                            <p>If you have forgotten your password or username please visit the Account Restore page.</p>
                                            <br>
                                            <h2 class="main-registration-header">Security Measure</h2>
                                            <img src="/assets/images/encryption_pc_ie.gif" align="right" class="image-right">
                                            <p>The real Habbo site is encrypted to protect you and your data. You can check whether or not this site is encrypted by looking for the nice looking padlock at the bottom of your web browser.</p>
                                        </div>
					                </div>
				                </div>
			                </div>
		                </div>
	                </div>
                </div>
            </div>
		</div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  }
}
</script>