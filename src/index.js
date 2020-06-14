import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './data/PeriodicTableJSON.json';
import infoIcon from './icons/information-info-svgrepo-com.svg';
import ReactTooltip from "react-tooltip";

class SearchElement extends React.Component{
    handleSearchElementChange = () => {
        var searchElement = this.input.value;
        this.props.onChangeHandler(searchElement);
    }

    render(){
        return(
            <>
                <div className="search-element">
                    <span>Search for element:</span>
                    <input 
                        ref={
                            (ref) => this.input = ref
                        }
                        onChange={this.handleSearchElementChange}
                        placeholder="Search by name"
                        ></input>
                </div>
            </>
        )
    }
}

function Help(props) {
    const instructions ="<b>Click:</b> Focus the clicked element in order to prevent accidentaly hover on other elements <br> <b>Double Click:</b> Opens the wikipedia source website ";

    return(
        <>
            <img data-tip={instructions} className="info-icon" src={infoIcon} alt="Info"/>
            <ReactTooltip html={true} className="tooltip"/>
        </>
    );
}

function MoreInfo(props) {
    return(
        <>
            <Element 
                mainClassName= {props.symbol ? "element-selected" : ""} 
                symbol={props.symbol}
                name={props.name}
                atomicmass={props.atomicmass}
                number={props.number}
                bgcolor={props.bgcolor}
                visibility={props.visibility}
            >
            </Element>
            <div 
                className="more-info"
                style={{
                    visibility: props.visibility,
                }}
            >
                <div className="more-info-data">
                    {props.phase ? <span className="more-info-text">{"Phase: " + props.phase}</span> : ""}
                    {props.appearance ? <span className="more-info-text">{"Appearance: " + props.appearance}</span> : ""}
                    {props.category ? <span className="more-info-text">{"Category: " + props.category}</span> : ""}
                    {props.density ? <span className="more-info-text">{"Density: " + props.density + " g/L"}</span> : ""}
                    {props.boil ? <span className="more-info-text">{"Boiling point: " + props.boil + " K"}</span> : ""}
                    {props.melt ? <span className="more-info-text">{"Melting point: " + props.melt + " K"}</span> : ""}
                    {props.discoveredBy ? <span className="more-info-text">{"Discovered by: " + props.discoveredBy}</span> : ""}
                    {props.namedBy ? <span className="more-info-text">{"Named by: " + props.namedBy}</span> : ""}
                </div>
            </div>
        </>
    );
}

function Element(props) {
    return(
        <>
            <div 
                onTouchStart={props.onMouseEnterHandler}
                onTouchEnd={e => e.preventDefault()}
                onMouseEnter={props.onMouseEnterHandler}
                onMouseLeave={props.onMouseLeaveHandler}
                onMouseDown={props.onMouseDownHandler}
                onDoubleClick={()=> props.source ? window.open(props.source, "_blank") : null}
                className={props.mainClassName + " " + props.bgcolor + (props.disable ? ' disable' : '' )}
                style={{
                    gridColumn: props.xpos, 
                    gridRow: props.ypos,
                    visibility: props.visibility,
                    pointerEvents: props.pointerEvents,
                }}>
                <div className="element-header-container">
                    <div className="element-number">{props.number}</div>
                </div>
                <div className="element-body-container">
                    <div className="element-symbol">{props.symbol}</div>
                    <div className="element-name">{props.name}</div>
                    <div className="element-atomic-mass">{props.atomicmass}</div>
                </div>
            </div>
        </>
    );
}

class PeriodicTable extends React.Component {
    constructor(props) {
        super(props);
        this.colorCode = this.colorCode.bind(this);
        this.state = {
            symbol: null,
            name: null,
            atomicmass: null,
            number: null,
            bgcolor: "",
            phase: "",
            appearance: "",
            category: "",
            density: "",
            boil: "",
            melt: "",
            discoveredBy: "",
            namedBy: "",
            visibility: "hidden",
            focusElement: false,
            source: null,
            searchValue: "",
        };
    }

    handleSearchElement = (search) => {
        this.setState({searchValue: search});
        let filteredElement = data.elements.find(element => element.name.toLowerCase().includes(search.toLowerCase()));
        let plm = filteredElement && search ? this.setState({
            symbol: filteredElement.symbol,
            name: filteredElement.name,
            atomicmass: filteredElement.atomic_mass,
            number: filteredElement.number,
            bgcolor: this.colorCode(filteredElement.category),
            phase: filteredElement.phase,
            appearance: filteredElement.appearance,
            category: filteredElement.category,
            density: filteredElement.density,
            boil: filteredElement.boil,
            melt: filteredElement.melt,
            discoveredBy: filteredElement.discovered_by,
            namedBy: filteredElement.named_by,
            visibility: 'visible'
        }) : this.setState({ 
            visibility: 'hidden'
        })
    }

    colorCode = (category) => {
        switch(true) {
            case category.includes('nonmetal'):
              return 'nonmetal';
            case category.includes('noble gas'):
              return 'noble-gas';
            case category.includes('alkali metal'):
              return 'alkali-metal';
            case category.includes('alkaline earth metal'):
                return 'alkaline-earth-metal';
            case category.includes('metalloid'):
                return 'metalloid';
            case category.includes('post-transition metal'):
                return 'post-transition-metal';
            case category.includes('transition metal'):
                return 'transition-metal';
            case category.includes('lanthanide'):
                return 'lanthanide';
            case category.includes('actinide'):
                return 'actinide';
            default:
              return 'white'
          }
    }

    render() {
        return(
            <div className="container">
                <Help />
                <div className="center-box">
                    <div className="periodic-table">
                        <SearchElement
                            onChangeHandler={this.handleSearchElement} />
                        <MoreInfo
                            symbol={this.state.symbol}
                            name={this.state.name}
                            atomicmass={this.state.atomicmass}
                            number={this.state.number}
                            bgcolor={this.state.bgcolor}
                            phase={this.state.phase}
                            appearance={this.state.appearance}
                            category={this.state.category}
                            density={this.state.density}
                            boil={this.state.boil}
                            melt={this.state.melt}
                            discoveredBy={this.state.discoveredBy}
                            namedBy={this.state.namedBy}
                            visibility={this.state.visibility}
                        />
                        {data.elements.map(element =>(
                            <Element 
                                key={element.number}
                                xpos={element.xpos}
                                ypos={element.ypos}
                                symbol={element.symbol} 
                                name={element.name} 
                                atomicmass={element.atomic_mass} 
                                number={element.number}
                                bgcolor={this.colorCode(element.category)}
                                mainClassName="element"
                                pointerEvents={element.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ? 'auto' : 'none'}
                                disable={element.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ? false : true }
                                source={element.source}
                                onMouseEnterHandler={() => !this.state.focusElement ? this.setState({
                                    symbol: element.symbol,
                                    name: element.name,
                                    atomicmass: element.atomic_mass,
                                    number: element.number,
                                    bgcolor: this.colorCode(element.category),
                                    phase: element.phase,
                                    appearance: element.appearance,
                                    category: element.category,
                                    density: element.density,
                                    boil: element.boil,
                                    melt: element.melt,
                                    discoveredBy: element.discovered_by,
                                    namedBy: element.named_by,
                                    visibility: "visible",
                                }) : ""}
                                onMouseLeaveHandler={() => !this.state.focusElement ? this.setState({
                                    visibility: "hidden",
                                }) : ""}
                                onMouseDownHandler={() => this.setState({
                                    focusElement: !this.state.focusElement,
                                })}/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <PeriodicTable />,
    document.getElementById('root')
  );