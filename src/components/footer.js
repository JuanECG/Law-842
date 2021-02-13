import { Layout } from 'antd';

const { Footer } = Layout;


const FooterCont = () => {
    return (
        <Footer>
            <div>                
                <p style={{ display: 'inline', fontWeight: 'bold' }}>Desarrollado e implementado por: </p>
                <h3 style={{ display: 'inline' }}>
                    Juan Esteban Castro Guerrero,
                    Peter D'loise Chicaiza Cortez,
                    Sebastian Alexander Diaz Paz
                </h3>
            </div>
            <b>© <a href="https://www.udenar.edu.co/">Universidad de Nariño,</a> 2021</b>
        </Footer>

    )
}

export default FooterCont;