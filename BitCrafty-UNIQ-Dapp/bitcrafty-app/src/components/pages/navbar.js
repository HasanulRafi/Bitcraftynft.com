import {Link} from 'react-router-dom'
import '../style/navbar.css';

function Navbar() {

    return (
        <>
            <nav className="navbar">
                <div className="navbarContainer">
                    <img src="images/blockchain-app logo.png" alt="Logo of the App" className="imgLogo"/>
                    <Link to="/" className="navbar-logo">
                        BitCrafty
                    </Link>
                </div>
                <ul className='nav-menu'>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links'>
                            View Handicrafts
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/post-handicraft-for-sale' className='nav-links'>
                            Sell New Handicrafts
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/view-all-owned-handicraft' className='nav-links'>
                            Owned Handicrafts
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/view-user-listed-handicraft' className='nav-links'>
                            My Listed Handicrafts
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/fetch-rewards' className='nav-links'>
                            My Rewards
                        </Link>
                    </li>
                </ul>

            </nav>
        </>
    )
}

export default Navbar