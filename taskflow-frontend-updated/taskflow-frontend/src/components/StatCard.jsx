function StatCard({ label, value, tone = "default" }) {
    return (
        <div className={`stat-card stat-card-${tone}`}>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
}

export default StatCard;
